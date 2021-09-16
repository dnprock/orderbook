import React from 'react'
import { OrderBookProps, OrderBookState } from './interfaces'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

class OrderBook extends React.Component<OrderBookProps, OrderBookState> {
  constructor(props: OrderBookProps) {
    super(props)

    this.state = {
      bookData: []
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <h1>OrderBook</h1>
    )
  }
}

export default OrderBook