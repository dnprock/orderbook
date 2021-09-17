import { render, screen } from '@testing-library/react'
import OrderBook from './OrderBook'

test('renders OrderBook title', () => {
  render(<OrderBook />)
  const textEl = screen.getByText(/Order Book/i)
  expect(textEl).toBeInTheDocument()
});
