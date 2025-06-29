import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext({ items: [], fetchItems: async () => {}, getItemById: async () => {} });

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  // Busca paginada, com cache que sobrescreve na page 1 e acumula nas demais
  const fetchItems = useCallback(async ({ signal, q = '', page = 1, pageSize = 50 } = {}) => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    params.append('page', String(page));
    params.append('pageSize', String(pageSize));

    const res = await fetch(`/api/items?${params.toString()}`, { signal });
    const json = await res.json();

    if (Array.isArray(json.items)) {
      setItems(prev => {
        if (page === 1) {
          // sobrescreve cache na nova busca ou página 1
          return json.items;
        } else {
          // acumula novas páginas, evitando duplicatas
          return [...prev, ...json.items.filter(it => !prev.some(p => p.id === it.id))];
        }
      });
    }
    return json;
  }, []);

  // Busca individual, tenta cache antes de buscar via API
  const getItemById = useCallback(
    async id => {
      const cached = items.find(i => String(i.id) === String(id));
      if (cached) return cached;

      const res = await fetch(`/api/items/${id}`);
      if (!res.ok) throw new Error('Not found');

      const data = await res.json();
      setItems(prev => (prev.some(i => i.id === data.id) ? prev : [...prev, data]));
      return data;
    },
    [items]
  );

  return (
    <DataContext.Provider value={{ items, fetchItems, getItemById }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
