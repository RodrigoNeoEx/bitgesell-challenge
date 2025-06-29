import React, { createContext, useCallback, useContext } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const fetchItems = useCallback(async ({ signal, q = '', page = 1, pageSize = 10 } = {}) => {
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    params.append('page', page);
    params.append('pageSize', pageSize);

    const res = await fetch(`http://localhost:3001/api/items?${params.toString()}`, { signal });
    return await res.json();
  }, []);

  return (
    <DataContext.Provider value={{ fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
