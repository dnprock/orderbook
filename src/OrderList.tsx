import React from 'react'
import { OrderListProps, OrderListState } from './interfaces'

class OrderList extends React.Component<OrderListProps, OrderListState> {
  private listRef: HTMLDivElement

  constructor(props: OrderListProps) {
    super(props)

    this.listRef = React.createRef<HTMLDivElement>().current!
    this.state = {
      scrollPosition: 0,
      pricePoints: props.pricePoints
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
    if (this.props.listType === 'sell') {
      // sell side, lowest price first
      prices.sort()
    } else {
      // buy side, highest price first
      prices.sort().reverse()
    }
    return (
      <div className='order-list col-1'>
        <div className='order-list-container' ref={this.setListRef}>
          <div className='price-row'>
            {this.props.listType === 'buy' &&
              <div className='order-list-header'>
                <div className='order-col-1'>TOTAL</div>
                <div className='order-col-1'>SIZE</div>
                <div className='order-col-2'>PRICE</div>
              </div>
            }
            {this.props.listType === 'sell' &&
              <div className='order-list-header'>
                <div className='order-col-2'>PRICE</div>
                <div className='order-col-1'>SIZE</div>
                <div className='order-col-1'>TOTAL</div>
              </div>
            }
          </div>
          {prices.map((price, index) => {
            total += this.props.pricePoints[price]
            const divTotal = <div key={'price-total-' + index} className='order-col-1 order-total'>{total}</div>
            const divSize = <div key={'price-size-' + index} className='order-col-1 order-size'>{this.props.pricePoints[price]}</div>
            const divPrice = <div key={'price-point-' + index} className='order-col-2 order-price'>{price}</div>
            if (this.props.listType === 'buy') {
              return (
                <div key={'price-row-' + index} className='price-row'>
                  {divTotal}
                  {divSize}
                  {divPrice}
                </div>
              )
            } else {
              return (
                <div key={'price-row-' + index} className='price-row'>
                  {divPrice}
                  {divSize}
                  {divTotal}
                </div>
              )
            }
          })}
        </div>
      </div>
    )
  }
}

export default OrderList