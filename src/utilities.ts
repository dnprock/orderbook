import { BookData, IDataHash } from "./interfaces"
import { format } from 'd3-format'
import { RowHeight } from "./Constants"

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

export const height = () => {
  const screenHeight = window.innerHeight - 100 - RowHeight // subtract page headers and footers and list headers
  if (isMobileView()) {
    return screenHeight / 2 - RowHeight // subtract a row for spread
  } else {
    return screenHeight
  }
}

export const width = () => {
  if (isMobileView()) {
    return window.innerWidth
  } else {
    return window.innerWidth / 2
  }
}

export const trimPricesForScreen = (prices: string[]) => {
  const orderListHeight = height()
  const numRows = orderListHeight / RowHeight
  return prices.slice(0, numRows)
}

export const calculatePricesAndTotals = (pricePoints: IDataHash, listType: string) => {
  let total = 0, totals: number[] = []
  let prices = Object.keys(pricePoints)
  if (listType === 'sell') {
    // sell side, lowest price first
    prices.sort()
  } else {
    // buy side, highest price first
    prices.sort().reverse()
  }
  prices = trimPricesForScreen(prices)
  // calculate totals
  if (listType === 'sell' && isMobileView()) {
    // in sell side mobile view, we reverse price display
    prices.reverse()
    // calculate totals from bottom up
    for (let i = prices.length - 1; i >= 0; i--) {
      const p = prices[i]
      total += pricePoints[p]
      totals.push(total)
    }
    totals.reverse()
  } else {
    prices.forEach((p) => {
      total += pricePoints[p]
      totals.push(total)
    })
  }

  return {prices: prices, totals: totals}
}