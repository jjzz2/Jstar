import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, onSearchChange }) => {
  const [search, setSearch] = useState('');

  const handleSearch = (val) => {
    setSearch(val);
    onSearchChange?.(val);
  };

  return (
    <div className="app-shell">
      <Header search={search} onSearchChange={handleSearch} />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          {children}
        </main>
        <aside className="app-tools">工具栏占位</aside>
      </div>
    </div>
  );
};

export default Layout;


