import React from 'react';
import { Button, Space } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="tabContainer">
      <Space className="tabButtons">
        <Button 
          type={activeTab === 'profile' ? 'primary' : 'default'}
          icon={<UserOutlined />}
          onClick={() => onTabChange('profile')}
        >
          个人资料
        </Button>
        <Button 
          type={activeTab === 'settings' ? 'primary' : 'default'}
          icon={<SettingOutlined />}
          onClick={() => onTabChange('settings')}
        >
          系统设置
        </Button>
      </Space>
    </div>
  );
};

export default TabNavigation;
