import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../state/DataContext';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById } = useData();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getItemById(id)
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/');
      });
  }, [id, getItemById, navigate]);

  if (loading)
    return (
      <div className="z-10 relative flex flex-col self-center justify-self-center min-w-[500px] p-4 border-gray-300 border mt-2 rounded-lg backdrop-blur-[15px] bg-[#f0f8ff54]">
        <div className="h-8 w-1/3 rounded bg-gray-200 animate-pulse mb-2" />
        <div className="h-6 w-2/3 rounded bg-gray-200 animate-pulse mb-1" />
        <div className="h-6 w-1/4 rounded bg-gray-200 animate-pulse" />
      </div>
    );

  if (!item) return null;

  return (
    <div className="z-10 relative flex flex-col self-center justify-self-center min-w-[500px] p-4 border-gray-300 border mt-2 rounded-lg backdrop-blur-[15px] bg-[#f0f8ff54]">
      <h2>{item.name}</h2>
      <p>
        <strong>Category:</strong> {item.category}
      </p>
      <p>
        <strong>Price:</strong> ${item.price}
      </p>
    </div>
  );
}

export default ItemDetail;
