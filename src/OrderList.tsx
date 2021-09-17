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

    this.setRef = this.setRef.bind(this)
  }

  componentDidMount() {
    this.listRef.addEventListener('scroll', this.updateScrollPosition)
  }
  componentWillUnmount() {
    this.listRef.removeEventListener('scroll', this.updateScrollPosition)
  }

  updateScrollPosition() {
  }

  setRef(element: HTMLDivElement) {
    this.listRef = element
  }

  render() {
    return (
      <div className='order-list' ref={this.setRef}>
        OrderList {this.props.listType}
        {this.props.pricePoints.map((point, index) => (
          <div key={'point-' + index}>{point[0]}: {point[1]}</div>
        ))}
      </div>
    )
  }
}

export default OrderList