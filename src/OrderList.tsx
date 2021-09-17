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
    return (
      <div className='order-list col-1'>
        <div className='order-list-container' ref={this.setListRef}>
          OrderList {this.props.listType}
          <div className='price-row'>
            <div className='order-col-1'>Total</div>
            <div className='order-col-1'>Size</div>
            <div className='order-col-2'>Price</div>
          </div>
          {this.props.pricePoints.map((point, index) => {
            total += point[1]
            return (
              <div key={'price-row-' + index} className='price-row'>
                <div key={'price-total-' + index} className='order-col-1'>{total}</div>
                <div key={'price-size-' + index} className='order-col-1'>{point[1]}</div>
                <div key={'price-point-' + index} className='order-col-2'>{point[0]}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default OrderList