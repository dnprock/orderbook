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
    console.log('scroll')
  }

  setListRef(element: HTMLDivElement) {
    this.listRef = element
  }

  render() {
    return (
      <div className='order-list col-1'>
        <div className='order-list-container' ref={this.setListRef}>
          OrderList {this.props.listType}
          {this.props.pricePoints.map((point, index) => (
            <div key={'point-' + index}>{point[0]}: {point[1]}</div>
          ))}
        </div>
      </div>
    )
  }
}

export default OrderList