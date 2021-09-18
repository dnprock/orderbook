import React from 'react'
import { OrderListProps, OrderListState } from './interfaces'

class OrderList extends React.Component<OrderListProps, OrderListState> {
  private listRef: HTMLDivElement

  constructor(props: OrderListProps) {
    super(props)

    this.listRef = React.createRef<HTMLDivElement>().current!
    this.state = {
      scrollPosition: 0
    }

    this.setListRef = this.setListRef.bind(this)
  }

  componentDidMount() {
    this.listRef.addEventListener('scroll', this.updateScrollPosition)
  }
  componentWillUnmount() {
    this.listRef.removeEventListener('scroll', this.updateScrollPosition)
  }

  updateScrollPosition() {
    // TODO: optimize scroll performance
  }

  setListRef(element: HTMLDivElement) {
    this.listRef = element
  }

  render() {
    let total = 0
    let prices = Object.keys(this.props.pricePoints)
    return (
      <div className='order-list col-1'>
        <div className='order-list-container' ref={this.setListRef}>
          OrderList {this.props.listType}
          <div className='price-row'>
            <div className='order-col-1'>Total</div>
            <div className='order-col-1'>Size</div>
            <div className='order-col-2'>Price</div>
          </div>
          {prices.map((price, index) => {
            total += this.props.pricePoints[price]
            return (
              <div key={'price-row-' + index} className='price-row'>
                <div key={'price-total-' + index} className='order-col-1 order-total'>{total}</div>
                <div key={'price-size-' + index} className='order-col-1 order-size'>{this.props.pricePoints[price]}</div>
                <div key={'price-point-' + index} className='order-col-2 order-price'>{price}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default OrderList