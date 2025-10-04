import React, { useState } from 'react';
import { Card, Form, Button, Typography, Divider, message, Space } from 'antd';
import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import UserHeader from './UserHeader';
import TabNavigation from './TabNavigation';
import ProfileForm from './ProfileForm';
import SettingsForm from './SettingsForm';
import styles from './styles.module.css';

const UserSettingsPage = () => {
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    if (activeTab === 'profile') {
      message.success('个人资料更新成功');
    } else {
      message.success('设置已保存');
    }
    console.log('Updated:', values);
  };


  const getInitialValues = () => {
    if (activeTab === 'profile') {
      return {
        name: user?.name || '',
        email: 'user@example.com',
        phone: '138****8888',
        bio: '这是一个示例用户简介'
      };
    } else {
      return {
        notifications: true,
        emailNotifications: false,
        language: 'zh-CN',
        theme: 'light',
        autoSave: true,
        aiAssistant: true
      };
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <UserHeader user={user} activeTab={activeTab} />

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <Form
          form={form}
          layout="vertical"
          initialValues={getInitialValues()}
          onFinish={handleSubmit}
        >
          {activeTab === 'profile' ? (
            <ProfileForm form={form} onFinish={handleSubmit} />
          ) : (
            <SettingsForm />
          )}

          <Divider />

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                icon={activeTab === 'profile' ? <EditOutlined /> : <SettingOutlined />}
                size="large"
                className={styles.submitButton}
              >
                {activeTab === 'profile' ? '更新资料' : '保存设置'}
              </Button>
              <Button size="large">
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UserSettingsPage;
