export interface OrderBookProps {

}

export interface OrderListProps {
  pricePoints: [number, number][]
  listType: 'buy' | 'sell'
}

export interface OrderListState {
  scrollPosition: number
}
export interface BookData {
  buy: [number, number][]
  sell: [number, number][]
}

export interface OrderBookState {
  bookData: BookData | null
  dataError: string
  connected: boolean
}