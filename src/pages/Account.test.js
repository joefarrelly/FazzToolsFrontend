import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Account from './Account';

jest.mock('axios');
jest.mock('cookies', () => ({ cookies: { get: jest.fn(() => 'user123'), set: jest.fn() } }));

function renderAccount() {
  return render(
    <MemoryRouter>
      <Account />
    </MemoryRouter>
  );
}

test('shows loading spinner while fetching', () => {
  axios.get.mockReturnValue(new Promise(() => {})); // never resolves
  renderAccount();
  expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
});

test('shows error message when request fails', async () => {
  axios.get.mockRejectedValue(new Error('Network Error'));
  renderAccount();
  await screen.findByText('Network Error');
  expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument();
});

test('renders alt data on success', async () => {
  axios.get.mockResolvedValue({
    data: [
      {
        alt_faction: 'Alliance',
        alt_level: 70,
        get_alt_race_display: 'Human',
        get_alt_class_display: 'Warrior',
        alt_name: 'Testchar',
        alt_realm: 'Stormrage',
        alt_account_id: 1,
      },
    ],
  });
  renderAccount();
  await screen.findByText('Testchar');
  expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument();
});

test('renders empty table (no rows) when API returns empty list', async () => {
  axios.get.mockResolvedValue({ data: [] });
  renderAccount();
  await waitFor(() =>
    expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument()
  );
  expect(screen.queryByText('Network Error')).not.toBeInTheDocument();
});
