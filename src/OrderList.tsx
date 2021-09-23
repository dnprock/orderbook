import { OrderListProps } from './interfaces'
import ListRow from './ListRow'
import OrderListBar from './OrderListBar'
import { isMobileView, width } from './utilities'

const OrderList = (props: OrderListProps) => {
  const listColor = () => {
    return props.listType === 'buy' ? 'limegreen' : 'red'
  }

  return (
    <div className='order-list col-1' style={{height: isMobileView() ? 'calc(50% - 10px)' : '100%'}}>
      <div className='order-list-container'>
        {props.listType === 'buy' && !isMobileView() && // don't display buy side header in mobile view
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
        <div className='price-table'>
          <div className='price-rows'>
            {props.prices.map((price, index) => {
              return <ListRow key={'list-row-' + index} listType={props.listType}
                        index={index} total={props.totals[index]} price={price}
                        size={props.pricePoints[price]}
                        color={listColor()}
                      />
            })}
          </div>
          <OrderListBar
            width={width()} height={26 * props.prices.length} totals={props.totals}
            color={listColor()}
            orientation={
              props.listType === 'sell' ? 'left' : (isMobileView() ? 'left' : 'right')}/>
        </div>
      </div>
    </div>
  )
}

export default OrderList