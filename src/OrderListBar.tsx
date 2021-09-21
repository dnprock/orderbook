import { OrderListBarProps } from "./interfaces"

const OrderListBar = (props: OrderListBarProps) => {
  console.log(props)

  const barHeight = 26 // height for each bar

  return (
    <div className='orderlist-bar-chart'>
      <svg width={props.width} height={props.height}>
        {props.prices.map((price, index) => {
          return <rect key={'bar-' + index} style={{fill: props.color, opacity: 0.4}}
                        x={0}
                        y={barHeight * index}
                        width={200}
                        height={barHeight - 1}
                />
        })}
      </svg>
    </div>
  )
}

export default OrderListBar