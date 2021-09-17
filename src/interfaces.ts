export interface OrderBookProps {

}

export interface OrderListProps {
  pricePoints: [number, number][]
  listType: 'buys' | 'sells'
}

export interface OrderListState {
  scrollPosition: number
}
export interface BookData {
  buys: [number, number][]
  sells: [number, number][]
}

export interface OrderBookState {
  bookData: BookData | null
  dataError: string
  connected: boolean
}