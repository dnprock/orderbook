import React from 'react'
import { ListRowProps } from "./interfaces";
import { formatNumber, formatPrice, isMobileView } from './utilities';

const ListRow = React.memo((props: ListRowProps) => {
  const divTotal = <div key={'price-total-' + props.index} className='order-col-1 order-total'>{formatNumber(props.total)}</div>
  const divSize = <div key={'price-size-' + props.index} className='order-col-1 order-size'>{formatNumber(props.size)}</div>
  const divPrice = <div key={'price-point-' + props.index}
    className='order-col-2 order-price'
    style={{color: props.color}} >{formatPrice(props.price)}</div>
  if (props.listType === 'buy') {
    if (isMobileView()) {
      return (
        <div key={'price-row-' + props.index} className='price-row'>
          {divPrice}
          {divSize}
          {divTotal}
        </div>
      )
    } else {
      return (
        <div key={'price-row-' + props.index} className='price-row'>
          {divTotal}
          {divSize}
          {divPrice}
        </div>
      )
    }
  } else {
    return (
      <div key={'price-row-' + props.index} className='price-row'>
        {divPrice}
        {divSize}
        {divTotal}
      </div>
    )
  }
})

export default ListRow