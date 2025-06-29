import { useEffect, useState, useMemo } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import SkeletonItem from '../components/SkeletonItem';

function Items() {
  const { items, fetchItems } = useData();

  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);


  const [data, setData] = useState({ items: [], total: 0, page: 1, pageSize: 50 });
  const [loading, setLoading] = useState(false);


  const filteredCacheItems = useMemo(() => {
    if (!items) return [];
    return items.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
  }, [items, q]);

  useEffect(() => {
    const pagedItems = filteredCacheItems.slice((page - 1) * pageSize, page * pageSize);

    if (pagedItems.length > 0) {
      setData({
        items: pagedItems,
        total: filteredCacheItems.length,
        page,
        pageSize,
      });
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    fetchItems({ signal: controller.signal, q, page, pageSize })
      .then(json => {
        setData(json || { items: [], total: 0, page: 1, pageSize });
      })
      .catch(e => {
        if (e.name !== 'AbortError') console.error(e);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();

  }, [fetchItems, q, page, pageSize, filteredCacheItems]);

  return (
    <div className="flex justify-center">
      <div className="min-w-[500px] mx-auto p-4 border-gray-300 border mt-2 rounded-lg z-10 backdrop-blur-[15px] bg-[#f0f8ff54]">
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setPage(1); }}
          placeholder="Search..."
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        {loading ? (
          <div>
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonItem key={i} />
            ))}
          </div>
        ) : (
          <List
            height={400}
            itemCount={data.items.length}
            itemSize={48}
            width="100%"
          >
            {({ index, style }) => {
              const item = data.items[index];
              return (
                <div
                  style={style}
                  key={item.id}
                  className="flex items-center px-4 hover:bg-gray-100 rounded"
                >
                  <Link to={'/items/' + item.id} className="text-blue-900 hover:underline">
                    {item.name}
                  </Link>
                </div>
              );
            }}
          </List>
        )}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>{page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * pageSize >= data.total}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
          <span className="ml-auto text-gray-500">Total: {data.total}</span>
        </div>
      </div>
    </div>
  );
}

export default Items;
