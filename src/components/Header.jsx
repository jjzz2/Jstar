import React from 'react';

const Header = ({ search, onSearchChange }) => {
  return (
    <header className="app-header">
      <div className="app-logo">Tencent Docs Clone</div>
      <input
        type="text"
        className="search-input"
        placeholder="搜索文档标题..."
        value={search}
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
    </header>
  );
};

export default Header;


