import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { fetchItems } = useData();

  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetchItems({ signal: controller.signal, q, page, pageSize })
      .then(json => {
        // Garante estrutura certa
        if (!json || !Array.isArray(json.items)) {
          setData({ items: [], total: 0, page: 1, pageSize: 10 });
        } else {
          setData(json);
        }
      })
      .catch(e => { if (e.name !== 'AbortError') console.error(e); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [fetchItems, q, page, pageSize]);

  // Sempre loga o valor ATUALIZADO
  useEffect(() => {
    console.log('Current data:', data);
  }, [data]);

  return (
    <>
      <input
        value={q}
        onChange={e => { setQ(e.target.value); setPage(1); }}
        placeholder="Search..."
      />
      {loading && <p>Loading...</p>}
      <ul>
        {data.items.map(item => (
          <li key={item.id}>
            <Link to={'/items/' + item.id}>{item.name}</Link>
          </li>
        ))}
      </ul>
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
