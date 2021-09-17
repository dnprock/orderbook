import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Orderbook title', () => {
  render(<App />);
  const textEl = screen.getByText(/Order Book/i);
  expect(textEl).toBeInTheDocument();
});
