import { BookData, IDataHash } from "./interfaces"
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

export const calculateSpread = (bookData: BookData | null) => {
  if (bookData) {
    const bids = Object.keys(bookData.buy).sort()
    const asks = Object.keys(bookData.sell).sort()
    // spread = (lowest ask - highest big) / midpoint * 100
    const avg = (+asks[0] + +bids[bids.length - 1]) / 2
    const spread = (+asks[0] - +bids[bids.length - 1])
    const percent = Math.round((+asks[0] - +bids[bids.length - 1]) / avg * 100 * 100) / 100
    return {spread: spread, spreadPercent: percent}
  } else {
    return {spread: 0, spreadPercent: 0}
  }
}

export const isMobileView = () => {
  return window.innerWidth <= 768
}