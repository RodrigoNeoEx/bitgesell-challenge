import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Items from './pages/Items';
import { MemoryRouter } from 'react-router-dom';

// Mock useData (return loaded itens)
jest.mock('./state/DataContext', () => ({
  useData: () => ({
    items: [
      { id: 1, name: 'Monitor' },
      { id: 2, name: 'Desk' }
    ],
    fetchItems: jest.fn(() => Promise.resolve({
      items: [
        { id: 1, name: 'Monitor' },
        { id: 2, name: 'Desk' }
      ],
      total: 2,
      page: 1,
      pageSize: 10,
    })),
  }),
}));

test('renders item names after fetch', async () => {
  render(
    <MemoryRouter>
      <Items />
    </MemoryRouter>
  );
  // await for async
  await waitFor(() => {
    expect(screen.getByText(/Monitor/i)).toBeInTheDocument();
    expect(screen.getByText(/Desk/i)).toBeInTheDocument();
  });
});
