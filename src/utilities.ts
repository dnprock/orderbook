import { IDataHash } from "./interfaces"
import { format } from 'd3-format'

export const convertBookDataToHash = (dataPoints: [number, number][]) => {
  let hash: IDataHash = {}
  dataPoints.forEach((pricePoint) => {
    hash[pricePoint[0].toString()] = pricePoint[1]
  })
  return hash
}

export const formatPrice = (p: string) => {
  return format(',.2f')(+p)
}

export const formatNumber = (n: number) => {
  return format(',')(n)
}