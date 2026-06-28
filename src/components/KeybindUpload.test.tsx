import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KeybindUpload from './KeybindUpload';

jest.mock('axios');
jest.mock('cookies', () => ({ cookies: { get: jest.fn(() => 'user123'), set: jest.fn() } }));

function luaFile(name = 'binds.lua', sizeBytes = 1024) {
  const file = new File(['x'], name, { type: 'text/plain' });
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

test('submit is disabled with no file selected', () => {
  render(<KeybindUpload inputKey={1} onChange={() => {}} />);
  expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
});

test('shows error and keeps submit disabled for non-.lua file', () => {
  render(<KeybindUpload inputKey={1} onChange={() => {}} />);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;

  const txtFile = new File(['content'], 'export.txt', { type: 'text/plain' });
  fireEvent.change(input, { target: { files: [txtFile] } });

  expect(screen.getByText('File must be a .lua file.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
});

test('shows error and keeps submit disabled for oversized .lua file', () => {
  render(<KeybindUpload inputKey={1} onChange={() => {}} />);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;

  const bigFile = luaFile('big.lua', 6 * 1024 * 1024);
  fireEvent.change(input, { target: { files: [bigFile] } });

  expect(screen.getByText('File must be under 5 MB.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
});

test('enables submit and clears errors for a valid .lua file', async () => {
  render(<KeybindUpload inputKey={1} onChange={() => {}} />);
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;

  await userEvent.upload(input, luaFile('FazzToolsScraperDB.lua', 50 * 1024));

  expect(screen.queryByText(/File must be/)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
});
