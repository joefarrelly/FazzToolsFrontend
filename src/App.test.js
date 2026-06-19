import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('axios');
jest.mock('cookies', () => ({ cookies: { get: jest.fn(() => null), set: jest.fn() } }));

test('renders brand heading', () => {
  render(<App />);
  expect(screen.getByText('Fazz Tools')).toBeInTheDocument();
});
