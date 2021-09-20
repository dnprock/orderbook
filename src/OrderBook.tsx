import React from 'react'
import './OrderBook.css'
import { FeedResponse, IDataHash, OrderBookProps, OrderBookState } from './interfaces'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket'
import OrderList from './OrderList'
import { UIMessages, BookDataConstants } from './Constants'
import { convertBookDataToHash } from './utilities'
import throttle from 'lodash/throttle'

const subMessage = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
let client: W3CWebSocket
const ReconnectWait = 3000
const RefreshRate = 0.001 // number of times to update every second
class OrderBook extends React.Component<OrderBookProps, OrderBookState> {
  constructor(props: OrderBookProps) {
    super(props)

    this.state = {
      bookData: null,
      dataError: '',
      connected: false
    }
  }

  throttledUpdateBook = throttle((bookData) => {
    this.setState({
      bookData: bookData
    })
  }, 1000 / RefreshRate)

  setupClient() {
    console.log('setupClient')
    client = new W3CWebSocket('wss://www.cryptofacilities.com/ws/v1')

    client.onopen = () => {
      client.send(subMessage)
      this.setState({
        connected: true
      })
    }
    client.onmessage = (message: IMessageEvent) => {
      try {
        const messageData: FeedResponse = JSON.parse(message.data.toString())

        // TODO: Remove this to enable live feed
        if (messageData.feed === BookDataConstants.SnapshotFeed) {
          console.log(message.data.toString())
        }

        if (messageData.feed === BookDataConstants.SnapshotFeed) {
          this.setState({
            bookData: {
              buy: convertBookDataToHash(messageData.bids),
              sell: convertBookDataToHash(messageData.asks)
            }
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
    client.onclose = () => {
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
    this.throttledUpdateBook(bookData)
  }

  componentDidMount() {
    this.setupClient()
  }

  componentWillUnmount() {
    // cancel any throttledUpdate call
    this.throttledUpdateBook.cancel()
    client.close()
  }

  render() {
    return (
      <div className='orderbook'>
        <div className='orderbook-header'>
          <b>Order Book</b>
        </div>
        {!this.state.connected && <div className='orderbook-loading'>{UIMessages.Loading}</div>}
        {this.state.dataError !== '' && <div className='orderbook-error'>{UIMessages.ErrorDataParse}</div>}
        {this.state.connected && this.state.dataError === '' && this.state.bookData &&
          <div className='lists'>
            <OrderList pricePoints={this.state.bookData.buy} listType={'buy'} />
            <OrderList pricePoints={this.state.bookData.sell} listType={'sell'} />
          </div>
        }
      </div>
    )
  }
}

export default OrderBook