import { OrderListProps } from './interfaces'
import ListRow from './ListRow'
import OrderListBar from './OrderListBar'
import { isMobileView } from './utilities'

const OrderList = (props: OrderListProps) => {
  const height = () => {
    const screenHeight = window.innerHeight - 100 - 26 // subtract page headers and footers and list headers
    if (isMobileView()) {
      return screenHeight / 2 - 26 // subtract a row for spread
    } else {
      return screenHeight
    }
  }

  const width = () => {
    return window.innerWidth / 2
  }

  const trimPricesForScreen = (prices: string[]) => {
    const rowHeight = 26
    const orderListHeight = height()
    const numRows = orderListHeight / rowHeight
    return prices.slice(0, numRows)
  }

  const listColor = () => {
    return props.listType === 'buy' ? 'limegreen' : 'red'
  }

  let total = 0
  let prices = Object.keys(props.pricePoints)
  if (props.listType === 'sell') {
    // sell side, lowest price first
    prices.sort()
  } else {
    // buy side, highest price first
    prices.sort().reverse()
  }
  prices = trimPricesForScreen(prices)
  return (
    <div className='order-list col-1' style={{height: isMobileView() ? 'calc(50% - 10px)' : '100%'}}>
      <div className='order-list-container'>
        <div className='price-row'>
          {props.listType === 'buy' &&
            <div className='order-list-header'>
              <div className='order-col-1'>TOTAL</div>
              <div className='order-col-1'>SIZE</div>
              <div className='order-col-2'>PRICE</div>
            </div>
          }
          {props.listType === 'sell' &&
            <div className='order-list-header'>
              <div className='order-col-2'>PRICE</div>
              <div className='order-col-1'>SIZE</div>
              <div className='order-col-1'>TOTAL</div>
            </div>
          }
        </div>
        <div className='price-table'>
          <div className='price-rows'>
            {prices.map((price, index) => {
              total += props.pricePoints[price]
              return <ListRow key={'list-row-' + index} listType={props.listType}
                        index={index} total={total} price={price}
                        size={props.pricePoints[price]}
                        color={listColor()}
                      />
            })}
          </div>
          <OrderListBar prices={prices} pricePoints={props.pricePoints}
            width={width()} height={26 * prices.length}
            color={listColor()} orientation={props.listType === 'buy' ? 'right' : 'left'}/>
        </div>
      </div>
    </div>
  )
}

export default OrderList