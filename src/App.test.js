import { render, screen } from '@testing-library/react';
import App from './App';

test('renders library and preview sections', () => {
  render(<App />);
  expect(screen.getByText(/library/i)).toBeInTheDocument();
  expect(screen.getByText(/preview/i)).toBeInTheDocument();
  expect(screen.getAllByText(/pop hits/i).length).toBeGreaterThan(0);
});
