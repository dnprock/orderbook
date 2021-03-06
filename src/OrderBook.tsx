import React from 'react'
import './OrderBook.css'
import { BookData, FeedResponse, IDataHash, OrderBookProps, OrderBookState } from './interfaces'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket'
import OrderList from './OrderList'
import { UIMessages, BookDataConstants } from './Constants'
import { calculatePricesAndTotals, calculateSpread, convertBookDataToHash, formatPrice, isMobileView } from './utilities'
import throttle from 'lodash/throttle'
import { concat } from 'lodash'

const subBTCMessage = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
const subETHMessage = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}'
const unsubBTCMessage = '{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
const unsubETHMessage = '{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}'
const wsUrl = 'wss://www.cryptofacilities.com/ws/v1'
const ReconnectWait = 3000
const RefreshRate = 0.2 // number of times to update every second
class OrderBook extends React.Component<OrderBookProps, OrderBookState> {
  private client: W3CWebSocket | null
  private coin: string

  constructor(props: OrderBookProps) {
    super(props)

    this.client = null
    this.coin = 'btc'

    this.state = {
      bookData: null,
      dataError: '',
      connected: false,
      spread: 0,
      spreadPercent: 0,
      inactive: false
    }

    this.toggleFeed = this.toggleFeed.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    this.handleReconnectClick = this.handleReconnectClick.bind(this)
  }

  updateBookState(bookData: BookData | null, spread: number, spreadPercent: number) {
    this.setState({
      bookData: bookData,
      spread: spread,
      spreadPercent: spreadPercent
    })
  }

  throttledUpdateBook = throttle((bookData: BookData | null, spread: number, spreadPercent: number) => {
    this.updateBookState(bookData, spread, spreadPercent)
  }, 1000 / RefreshRate)

  setupClient() {
    console.log('setupClient')
    this.client = new W3CWebSocket(wsUrl)

    this.client.onopen = () => {
      this.client && this.client.send(subBTCMessage)
      this.setState({
        connected: true
      })
    }
    this.client.onmessage = (message: IMessageEvent) => {
      try {
        const messageData: FeedResponse = JSON.parse(message.data.toString())

        // TODO: Remove this to enable live feed
        if (messageData.feed === BookDataConstants.SnapshotFeed) {
          console.log(message.data.toString())
        }

        if (messageData.feed === BookDataConstants.SnapshotFeed) {
          const bd = {
            buy: convertBookDataToHash(messageData.bids),
            sell: convertBookDataToHash(messageData.asks)
          }
          const sp = calculateSpread(bd)
          this.setState({
            bookData: bd,
            spread: sp.spread,
            spreadPercent: sp.spreadPercent
          })
        } else if (messageData.feed === BookDataConstants.UpdateFeed
            && !messageData.event) {
          this.updateFeed(messageData, true)
        }
      } catch (e) {
        this.setState({
          dataError: UIMessages.ErrorDataParse
        })
      }
    }
    this.client.onclose = () => {
      console.log('onclose')
      // only attempt to reconnect if the state is inactive
      const self = this
      if (!this.state.inactive) {
        setTimeout(function() {
          self.setupClient()
        }, ReconnectWait)
      }
    }
  }

  updateBook(dataHash: IDataHash, pricePoint: [number, number]) {
    const priceStr = pricePoint[0].toString()
    if (dataHash[priceStr]) {
      // if price exists in hash, update size
      if (pricePoint[1] === 0) {
        // remove price point
        delete dataHash[priceStr]
      } else {
        // update new book size for price point
        dataHash[priceStr] = pricePoint[1]
      }
    } else {
      // if price does not exist in hash, add
      if (pricePoint[1] !== 0) {
        dataHash[priceStr] = pricePoint[1]
      }
    }
  }

  updateFeed(messageData: FeedResponse, throttled: boolean) {
    let bookData = this.state.bookData
    messageData.bids.forEach((pricePoint) => {
      if (bookData) {
        this.updateBook(bookData.buy, pricePoint)
      }
    })
    messageData.asks.forEach((pricePoint) => {
      if (bookData) {
        this.updateBook(bookData.sell, pricePoint)
      }
    })
    const sp = calculateSpread(this.state.bookData)
    if (throttled) {
      this.throttledUpdateBook(bookData, sp.spread, sp.spreadPercent)
    } else {
      this.updateBookState(bookData, sp.spread, sp.spreadPercent)
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.throttledUpdateBook.cancel()
      this.client && this.client.close()
      this.setState({
        inactive: true
      })
    }
  }

  handleReconnectClick(e: React.MouseEvent<HTMLAnchorElement>) {
    this.setState({
      inactive: false
    })
    this.setupClient()
    e.preventDefault()
    return false
  }

  addVisibilityListener() {
    document.addEventListener("visibilitychange", this.handleVisibilityChange)
  }

  removeVisibilityListener() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange)
  }

  componentDidMount() {
    this.setupClient()
    this.addVisibilityListener()
  }

  componentWillUnmount() {
    // cancel any throttledUpdate call
    this.throttledUpdateBook.cancel()
    this.client && this.client.close()
    this.removeVisibilityListener()
  }

  spreadText() {
    return (this.state.spread === 0 ? 'Spread' :
      'Spread ' + formatPrice(this.state.spread + '') + ' (' + this.state.spreadPercent + '%)')
  }

  toggleFeed() {
    if (this.coin === 'btc') {
      // unsub btc
      this.client && this.client.send(unsubBTCMessage)
      // sub eth
      this.client && this.client.send(subETHMessage)
      this.coin = 'eth'
    } else if (this.coin === 'eth') {
      // unsub eth
      this.client && this.client.send(unsubETHMessage)
      // sub btc
      this.client && this.client.send(subBTCMessage)
      this.coin = 'btc'
    }
  }

  render() {
    let buyPrices: string[] = [], buyTotals: number[] = []
    let sellPrices: string[] = [], sellTotals: number[] = []
    let maxTotal = 0
    if (this.state.bookData) {
      const buy = calculatePricesAndTotals(this.state.bookData.buy, 'buy')
      buyPrices = buy.prices
      buyTotals = buy.totals
      const sell = calculatePricesAndTotals(this.state.bookData.sell, 'sell')
      sellPrices = sell.prices
      sellTotals = sell.totals
      maxTotal = Math.max(...concat(buy.totals, sell.totals))
    }
    return (
      <div className="container">
        <div className='orderbook-header'>
          <div className="orderbook-header-left"><b>Order Book</b></div>
          <div className="orderbook-header-center">{!isMobileView() ? this.spreadText() : '\u00A0'}</div>
          <div className="orderbook-header-right">{this.coin === 'btc' ? 'BTCUSD' : 'ETHUSD'}</div>
        </div>
        <div className='orderbook'>
          {!this.state.connected && <div className='orderbook-loading orderbook-status'>{UIMessages.Loading}</div>}
          {this.state.dataError !== '' && <div className='orderbook-error orderbook-status'>{UIMessages.ErrorDataParse}</div>}
          {this.state.connected && this.state.dataError === '' && this.state.bookData && !isMobileView() &&
            <div className='lists'>
              <OrderList pricePoints={this.state.bookData.buy} listType={'buy'} prices={buyPrices} totals={buyTotals} maxTotal={maxTotal} />
              <OrderList pricePoints={this.state.bookData.sell} listType={'sell'} prices={sellPrices} totals={sellTotals} maxTotal={maxTotal} />
            </div>
          }
          {this.state.connected && this.state.dataError === '' && this.state.bookData && isMobileView() &&
            <div className='lists'>
              <OrderList pricePoints={this.state.bookData.sell} listType={'sell'} prices={sellPrices} totals={sellTotals} maxTotal={maxTotal} />
              {isMobileView() && <div style={{width: '100%', float: 'left', marginTop: '15px'}}>{this.spreadText()}</div>}
              <OrderList pricePoints={this.state.bookData.buy} listType={'buy'} prices={buyPrices} totals={buyTotals} maxTotal={maxTotal} />
            </div>
          }
        </div>
        {!isMobileView() &&
          <div className='orderbook-bottom'>
            <button className='feed-toggle' onClick={this.toggleFeed}>Toggle Feed</button>
          </div>
        }
        {isMobileView() && <div className='orderbook-bottom'><button className='feed-toggle' onClick={this.toggleFeed}>Toggle Feed</button></div>}
        <div id='open-modal' className='modal-window' style={{display: this.state.inactive ? 'inline' : 'none'}}>
          <div>
            <div className='modal-header'>Disconnected</div>
            <div>Order Book was disconnected due to inactivity. Click Reconnect to resume feed.</div>
            <div className='modal-button'>
              <a href='#modal-reconnect' title='Reconnect' className='modal-reconnect reconnect-button'
                onClick={this.handleReconnectClick}>Reconnect</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default OrderBook