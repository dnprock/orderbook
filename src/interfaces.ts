export interface OrderBookProps {

}

export interface BookData {
  buys: []
  sells: []
}

export interface OrderBookState {
  bookData: BookData
  dataError: string
  connected: boolean
}