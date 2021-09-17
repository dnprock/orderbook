export interface OrderBookProps {

}

export interface OrderListProps {
  pricePoints: []
  listType: 'buys' | 'sells'
}

export interface BookData {
  buys: []
  sells: []
}

export interface OrderBookState {
  bookData: BookData | null
  dataError: string
  connected: boolean
}