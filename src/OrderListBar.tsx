import { OrderListBarProps } from './interfaces'
import { scaleLinear } from 'd3-scale'

const OrderListBar = (props: OrderListBarProps) => {
  const barHeight = 26 // height for each bar
  let barData: [string, number][] = []
  let total = 0
  props.prices.forEach((p) => {
    total += props.pricePoints[p]
    barData.push([p, total])
  })
  const max = Math.max(...barData.map((d) => { return d[1]}))

  const xScale = scaleLinear()
              .range([0, props.width])
              .domain([0, max])

  return (
    <div className='orderlist-bar-chart'>
      <svg width={props.width} height={props.height}>
        {props.prices.map((price, index) => {
          return <rect key={'bar-' + index} style={{fill: props.color, opacity: 0.2}}
                        x={props.orientation === 'left' ? 0 : (props.width - xScale(barData[index][1]))}
                        y={barHeight * index}
                        width={xScale(barData[index][1])}
                        height={barHeight}
                />
        })}
      </svg>
    </div>
  )
}

export default OrderListBar
