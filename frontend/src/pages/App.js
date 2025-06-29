import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import bg from '../assets/img/bg.jpg'

function App() {
  return (
    <DataProvider>
      <img src={bg} className='w-full h-screen absolute z-0 opacity-40'/>
      <nav style={{padding: 16, borderBottom: '1px solid #ddd'}}>
        <Link to="/">Items</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </DataProvider>
  );
}

export default App;