import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Orderbook title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Order Book/i);
  expect(linkElement).toBeInTheDocument();
});
