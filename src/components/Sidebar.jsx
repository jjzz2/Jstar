import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, DeleteOutlined } from '@ant-design/icons';

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
      style={{ 
        border: 'none',
        paddingTop: '16px'
      }}
    />
  );
};

export default Sidebar;


