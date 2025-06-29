import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Items from './pages/Items';
import * as DataContext from './state/DataContext';

describe('Items component', () => {
  const mockItems = [
    { id: 1, name: 'Monitor' },
    { id: 2, name: 'Desk' },
  ];

  beforeEach(() => {
    jest.spyOn(DataContext, 'useData').mockReturnValue({
      items: mockItems,
      fetchItems: jest.fn(() => Promise.resolve({
        items: mockItems,
        total: mockItems.length,
        page: 1,
        pageSize: 50,
      })),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders item names after fetch', async () => {
    render(
      <MemoryRouter>
        <Items />
      </MemoryRouter>
    );

    // Espera elementos renderizarem após fetchItems ser chamado e estado atualizado
    await waitFor(() => {
      expect(screen.getByText(/Monitor/i)).toBeInTheDocument();
      expect(screen.getByText(/Desk/i)).toBeInTheDocument();
    });
  });
});
