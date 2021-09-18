import React from 'react'
import './OrderBook.css'
import { FeedResponse, OrderBookProps, OrderBookState } from './interfaces'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket'
import OrderList from './OrderList'
import { UIMessages, BookDataConstants } from './Constants'

const subMessage = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
let client: W3CWebSocket
const ReconnectWait = 3000
class OrderBook extends React.Component<OrderBookProps, OrderBookState> {
  private count = 0

  constructor(props: OrderBookProps) {
    super(props)

    this.state = {
      bookData: null,
      dataError: '',
      connected: false
    }
  }

  setupClient() {
    client = new W3CWebSocket('wss://www.cryptofacilities.com/ws/v1')
    const self = this
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
        this.count++
        if (this.count < 20) {
          console.log(message.data.toString())
        } else {
          // TODO: close connection for test, Remove after
          client.close()
        }

        if (messageData.feed === BookDataConstants.SnapshotFeed) {
          this.setState({
            bookData: {
              buy: messageData.bids,
              sell: messageData.asks
            }
          })
        } else if (messageData.feed === BookDataConstants.UpdateFeed) {
          this.updateFeed(messageData)
        }
      } catch (e) {
        this.setState({
          dataError: UIMessages.ErrorDataParse
        })
      }
    }
    client.onclose = () => {
      // TODO: simulate test for this
      setTimeout(function() {
        self.setupClient()
      }, ReconnectWait)
    }
  }

  updateFeed(messageData: FeedResponse) {
    // convert current bookData to a hash for faster lookup
  }

  componentDidMount() {
    this.setupClient()
  }

  componentWillUnmount() {
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