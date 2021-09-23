export interface OrderBookProps {

}

export interface OrderListProps {
  pricePoints: IDataHash
  listType: 'buy' | 'sell'
  prices: string[]
  totals: number[]
}

export interface IDataHash {
  [price: string]: number
}
export interface BookData {
  buy: IDataHash
  sell: IDataHash
}

export interface OrderBookState {
  bookData: BookData | null
  spread: number
  spreadPercent: number
  dataError: string
  connected: boolean
  inactive: boolean
}

export interface FeedResponse {
  event: string | null
  feed: string
  product_id: string
  bids: [number, number][] | []
  asks: [number, number][] | []
}

export interface OrderListBarProps {
  width: number
  height: number
  color: string
  orientation: string
  totals: number[]
}

export interface ListRowProps {
  total: number
  size: number
  price: string
  index: number
  color: string
  listType: string
}