import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { logout } from '../../store/authSlice';
import { SearchInput } from '../Common';
import { useAuth } from '../../hooks';
import styles from './styles.module.css';

const HISTORY_KEY = 'search_history';

const Header = ({ search, onSearchChange }) => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      navigate('/settings');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        腾讯文档克隆
      </div>
      
      <div className={styles.rightSection}>
        <div className={styles.searchContainer}>
          <SearchInput
            placeholder="搜索文档标题..."
            value={search}
            onSearchChange={onSearchChange}
            className={styles.searchInput}
            size="middle"
          />
        </div>

        {/* User Avatar and Menu */}
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleMenuClick }}
          placement="bottomRight"
          trigger={['click']}
        >
          <div className={styles.userMenu}>
            <Space>
              <Avatar 
                size="small" 
                className={styles.avatar}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Typography.Text className={styles.userName}>
                {user?.name || '用户'}
              </Typography.Text>
            </Space>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;

