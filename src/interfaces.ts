export interface OrderBookProps {

}

export interface OrderListProps {
  pricePoints: IDataHash
  listType: 'buy' | 'sell'
}

export interface OrderListState {
  scrollPosition: number,
  pricePoints: IDataHash
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
}

export interface FeedResponse {
  event: string | null
  feed: string
  product_id: string
  bids: [number, number][] | []
  asks: [number, number][] | []
}