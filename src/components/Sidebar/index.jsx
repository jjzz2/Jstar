import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import styles from './styles.module.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '我的文档',
    },
    {
      key: '/forms',
      icon: <FormOutlined />,
      label: '我的表单',
    },
    {
      key: '/trash',
      icon: <DeleteOutlined />,
      label: '回收站',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={handleMenuClick}
      className={styles.sidebar}
    />
  );
};

export default Sidebar;

