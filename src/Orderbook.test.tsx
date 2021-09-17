import { render, screen } from '@testing-library/react'
import OrderBook from './OrderBook'

test('renders OrderBook title', () => {
  render(<OrderBook />);
  const linkElement = screen.getByText(/Order Book/i)
  expect(linkElement).toBeInTheDocument()
});
