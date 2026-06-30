import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

function ThrowingComponent(): never {
  throw new Error('boom');
}

let consoleSpy: jest.SpyInstance<void, Parameters<typeof console.error>>;

beforeEach(() => {
  consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  consoleSpy.mockRestore();
});

test('renders children normally', () => {
  render(
    <ErrorBoundary>
      <div>child content</div>
    </ErrorBoundary>
  );
  expect(screen.getByText('child content')).toBeInTheDocument();
});

test('renders fallback when child throws', () => {
  render(
    <ErrorBoundary>
      <ThrowingComponent />
    </ErrorBoundary>
  );
  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  expect(screen.getByText('boom')).toBeInTheDocument();
});

test('does not show fallback while children are healthy', () => {
  render(
    <ErrorBoundary>
      <p>ok</p>
    </ErrorBoundary>
  );
  expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
});
