import { OrderListBarProps } from './interfaces'
import { scaleLinear } from 'd3-scale'

const OrderListBar = (props: OrderListBarProps) => {
  const barHeight = 26 // height for each bar

  const xScale = scaleLinear()
              .range([0, props.width])
              .domain([0, props.maxTotal])

  return (
    <div className='orderlist-bar-chart'>
      <svg width={props.width} height={props.height}>
        {props.totals.map((total, index) => {
          return <rect key={'bar-' + index} style={{fill: props.color, opacity: 0.2}}
                        x={props.orientation === 'left' ? 0 : (props.width - xScale(total))}
                        y={barHeight * index}
                        width={xScale(total)}
                        height={barHeight}
                />
        })}
      </svg>
    </div>
  )
}

export default OrderListBar
