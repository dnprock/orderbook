import React from 'react'
import './OrderBook.css'
import { FeedResponse, IDataHash, OrderBookProps, OrderBookState } from './interfaces'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket'
import OrderList from './OrderList'
import { UIMessages, BookDataConstants } from './Constants'
import { calculateSpread, convertBookDataToHash, formatPrice } from './utilities'
import throttle from 'lodash/throttle'

const subBTCMessage = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
const subETHMessage = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}'
const unsubBTCMessage = '{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
const unsubETHMessage = '{"event":"unsubscribe","feed":"book_ui_1","product_ids":["PI_ETHUSD"]}'
const wsUrl = 'wss://www.cryptofacilities.com/ws/v1'
const ReconnectWait = 3000
const RefreshRate = 0.5 // number of times to update every second
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
    }

    this.toggleFeed = this.toggleFeed.bind(this)
  }

  throttledUpdateBook = throttle((bookData, spread, spreadPercent) => {
    this.setState({
      bookData: bookData,
      spread: spread,
      spreadPercent: spreadPercent
    })
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
          this.updateFeed(messageData)
        }
      } catch (e) {
        this.setState({
          dataError: UIMessages.ErrorDataParse
        })
      }
    }
    this.client.onclose = () => {
      console.log('onclose')
      setTimeout(function() {
        //self.setupClient()
      }, ReconnectWait)
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

  updateFeed(messageData: FeedResponse) {
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
    this.throttledUpdateBook(bookData, sp.spread, sp.spreadPercent)
  }

  componentDidMount() {
    this.setupClient()
  }

  componentWillUnmount() {
    // cancel any throttledUpdate call
    this.throttledUpdateBook.cancel()
    this.client && this.client.close()
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
    return (
      <div className="container">
        <div className='orderbook-header'>
          <div className="orderbook-header-left"><b>Order Book</b></div>
          <div className="orderbook-header-center">{this.spreadText()}</div>
          <div className="orderbook-header-right">{this.coin === 'btc' ? 'BTCUSD' : 'ETHUSD'}</div>
        </div>
        <div className='orderbook'>
          {!this.state.connected && <div className='orderbook-loading orderbook-status'>{UIMessages.Loading}</div>}
          {this.state.dataError !== '' && <div className='orderbook-error orderbook-status'>{UIMessages.ErrorDataParse}</div>}
          {this.state.connected && this.state.dataError === '' && this.state.bookData &&
            <div className='lists'>
              <OrderList pricePoints={this.state.bookData.buy} listType={'buy'} />
              <OrderList pricePoints={this.state.bookData.sell} listType={'sell'} />
            </div>
          }
        </div>
        <div className='orderbook-bottom'>
          <button className='feed-toggle' onClick={this.toggleFeed}>Toggle Feed</button>
        </div>
      </div>
    )
  }
}

export default OrderBook