import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

function Items() {
  const { fetchItems } = useData();

  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50); // aumente se quiser testar scroll
  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchItems({ signal: controller.signal, q, page, pageSize })
      .then(json => setData(json || { items: [], total: 0, page: 1, pageSize: 10 }))
      .catch(e => { if (e.name !== 'AbortError') console.error(e); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [fetchItems, q, page, pageSize]);

  // Renderiza apenas o que está na viewport
  return (
    <>
      <input
        value={q}
        onChange={e => { setQ(e.target.value); setPage(1); }}
        placeholder="Search..."
      />
      {loading && <p>Loading...</p>}
      <List
        height={400}
        itemCount={data.items.length}
        itemSize={48}
        width="100%"
      >
        {({ index, style }) => {
          const item = data.items[index];
          return (
            <div style={style} key={item.id}>
              <Link to={'/items/' + item.id}>{item.name}</Link>
            </div>
          );
        }}
      </List>
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>{page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * pageSize >= data.total}
        >Next</button>
      </div>
      <div>
        <span>Total: {data.total}</span>
      </div>
    </>
  );
}

export default Items;
