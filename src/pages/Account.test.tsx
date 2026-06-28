import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Account from './Account';

jest.mock('axios');
jest.mock('cookies', () => ({ cookies: { get: jest.fn(() => 'user123'), set: jest.fn() } }));

const mockedAxios = jest.mocked(axios);

function renderAccount() {
  return render(
    <MemoryRouter>
      <Account />
    </MemoryRouter>
  );
}

test('shows loading spinner while fetching', () => {
  mockedAxios.get.mockReturnValue(new Promise(() => {}));
  renderAccount();
  expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
});

test('shows error message when request fails', async () => {
  mockedAxios.get.mockRejectedValue(new Error('Network Error'));
  renderAccount();
  await screen.findByText('Network Error');
  expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument();
});

test('renders alt data on success', async () => {
  mockedAxios.get.mockResolvedValue({
    data: [['Alliance', 70, 'Human', 'Warrior', 'Testchar', 'Stormrage', 1]],
  });
  renderAccount();
  await screen.findByText('Testchar');
  expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument();
});

test('renders empty table (no rows) when API returns empty list', async () => {
  mockedAxios.get.mockResolvedValue({ data: [] });
  renderAccount();
  await waitFor(() =>
    expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument()
  );
  expect(screen.queryByText('Network Error')).not.toBeInTheDocument();
});
