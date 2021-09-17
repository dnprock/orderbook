import React from 'react'
import './OrderBook.css'
import { OrderBookProps, OrderBookState } from './interfaces'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket'
import OrderList from './OrderList'

// string constants for future localization
const UIMessages = {
  Loading: 'Loading...',
  ErrorDataParse: 'Unable to parse server data'
}

const BookDataConstants = {
  Feed: 'feed',
  Asks: 'asks',
  Bids: 'bids',
  SnapshotFeed: 'book_ui_1_snapshot'
}

const subMessage = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
let client: W3CWebSocket
//const ReconnectWait = 3000
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
    //const self = this
    client.onopen = () => {
      client.send(subMessage)
      this.setState({
        connected: true
      })
    }
    client.onmessage = (message: IMessageEvent) => {
      try {
        const messageData = JSON.parse(message.data.toString())

        // TODO: Remove this to enable live feed
        this.count++
        if (this.count < 20) {
          console.log(messageData)
        } else {
          // TODO: close connection for test, Remove after
          client.close()
        }

        if (messageData[BookDataConstants.Feed] === BookDataConstants.SnapshotFeed) {
          this.setState({
            bookData: {
              buy: messageData[BookDataConstants.Bids],
              sell: messageData[BookDataConstants.Asks]
            }
          })
        }
      } catch (e) {
        this.setState({
          dataError: UIMessages.ErrorDataParse
        })
      }
    }
    client.onclose = () => {
      // TODO: simulate test for this
      //setTimeout(function() {
      //  self.setupClient()
      //}, ReconnectWait)
    }
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