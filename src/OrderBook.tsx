import React from 'react'
import './OrderBook.css'
import { OrderBookProps, OrderBookState } from './interfaces'
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket'

// string constants for future localization
const UIMessages = {
  Loading: 'Loading...',
  ErrorDataParse: 'Unable to parse server data'
}

let client = new W3CWebSocket('wss://www.cryptofacilities.com/ws/v1')
const subMessage = '{"event":"subscribe","feed":"book_ui_1","product_ids":["PI_XBTUSD"]}'
class OrderBook extends React.Component<OrderBookProps, OrderBookState> {
  private count = 0

  constructor(props: OrderBookProps) {
    super(props)

    this.state = {
      bookData: [],
      dataError: '',
      connected: false
    }
  }

  setupClient() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
      client.send(subMessage)
      this.setState({
        connected: true
      })
    }
    client.onmessage = (message: IMessageEvent) => {
      this.count++
      try {
        // TODO: Test malformed data
        const messageData = JSON.parse(message.data.toString())

        if (this.count < 20) {
          console.log(messageData)
        }
      } catch (e) {
        this.setState({
          dataError: UIMessages.ErrorDataParse
        })
      }
    }
    const self = this
    client.onclose = () => {
      // TODO: simulate test for this
      setTimeout(function() {
        self.setupClient()
      }, 3000)
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
      <div className="orderbook">
        <h3>OrderBook</h3>
        {!this.state.connected && <div className="orderbook-loading">{UIMessages.Loading}</div>}
        {this.state.dataError !== '' && <div className="orderbook-error">{UIMessages.ErrorDataParse}</div>}
      </div>
    )
  }
}

export default OrderBook