import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const UserHeader = ({ user, activeTab }) => {
  return (
    <div className="header">
      <Avatar 
        size={80} 
        icon={<UserOutlined />}
        className="avatar"
      />
      <Title level={3} className="userName">
        {user?.name || '用户'}
      </Title>
      <Text type="secondary" className="subtitle">
        {activeTab === 'profile' ? '个人资料管理' : '系统设置'}
      </Text>
    </div>
  );
};

export default UserHeader;
