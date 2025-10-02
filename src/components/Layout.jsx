import React, { useState } from 'react';
import { Layout as AntLayout } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';

const { Header: AntHeader, Sider, Content } = AntLayout;

const Layout = ({ children, onSearchChange }) => {
  const [search, setSearch] = useState('');

  const handleSearch = (val) => {
    setSearch(val);
    onSearchChange?.(val);
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <AntHeader style={{ padding: 0, background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <Header search={search} onSearchChange={handleSearch} />
      </AntHeader>
      <AntLayout>
        <Sider 
          width={240} 
          style={{ 
            background: '#fff', 
            borderRight: '1px solid #f0f0f0',
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            left: 0,
            top: 64,
            zIndex: 1
          }}
        >
          <Sidebar />
        </Sider>
        <Content 
          style={{ 
            marginLeft: 240, 
            padding: '24px',
            background: '#fff',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;


