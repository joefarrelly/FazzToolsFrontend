import { render, screen } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');
jest.mock('cookies', () => ({ cookies: { get: jest.fn(() => null), set: jest.fn() } }));

const mockedAxios = jest.mocked(axios);

test('renders brand heading', async () => {
  mockedAxios.get.mockResolvedValue({ data: [] });
  render(<App />);
  expect(await screen.findByText('Fazz Tools')).toBeInTheDocument();
});
