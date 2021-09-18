import { IDataHash } from "./interfaces"

export const convertBookDataToHash = (dataPoints: [number, number][]) => {
  let hash: IDataHash = {}
  dataPoints.forEach((pricePoint) => {
    hash[pricePoint[0].toString()] = pricePoint[1]
  })
  return hash
}