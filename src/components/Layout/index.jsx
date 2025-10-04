import React, { useState } from 'react';
import { Layout as AntLayout } from 'antd';
import Header from '../Header';
import Sidebar from '../Sidebar';
import AiAssistant from '../AiAssistant';
import styles from './styles.module.css';

const { Header: AntHeader, Sider, Content } = AntLayout;

const Layout = ({ children, onSearchChange }) => {
  const [search, setSearch] = useState('');

  const handleSearch = (val) => {
    setSearch(val);
    onSearchChange?.(val);
  };

  return (
    <AntLayout className={styles.layout}>
      <AntHeader className={styles.header}>
        <Header search={search} onSearchChange={handleSearch} />
      </AntHeader>
      <AntLayout>
        <Sider className={styles.sider}>
          <Sidebar />
        </Sider>
        <Content className={styles.content}>
          {children}
        </Content>
      </AntLayout>
      <AiAssistant />
    </AntLayout>
  );
};

export default Layout;