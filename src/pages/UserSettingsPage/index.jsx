import React, { useState } from 'react';
import { Card, Form, Button, Avatar, Typography, Divider, message, Space } from 'antd';
import { UserOutlined, EditOutlined, SettingOutlined, BellOutlined, SecurityScanOutlined, GlobalOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { UserNameField, EmailField, PhoneField, TextAreaField, SwitchField, SelectField } from '../../components/Common';
import styles from './styles.module.css';

const { Title, Text } = Typography;

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

  const profileFormItems = [
    { name: 'name', label: '用户名', rules: [{ required: true, message: '请输入用户名' }] },
    { name: 'email', label: '邮箱' },
    { name: 'phone', label: '手机号' },
    { name: 'bio', label: '个人简介' }
  ];

  const settingsFormItems = [
    { name: 'notifications', label: '启用通知', valuePropName: 'checked' },
    { name: 'emailNotifications', label: '邮件通知', valuePropName: 'checked' },
    { name: 'language', label: '语言', options: [
      { value: 'zh-CN', label: '简体中文' },
      { value: 'en-US', label: 'English' }
    ]},
    { name: 'theme', label: '主题', options: [
      { value: 'light', label: '浅色主题' },
      { value: 'dark', label: '深色主题' },
      { value: 'auto', label: '跟随系统' }
    ]},
    { name: 'autoSave', label: '自动保存', valuePropName: 'checked' },
    { name: 'aiAssistant', label: 'AI助手', valuePropName: 'checked' }
  ];

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
        <div className={styles.header}>
          <Avatar 
            size={80} 
            icon={<UserOutlined />}
            className={styles.avatar}
          />
          <Title level={3} className={styles.userName}>
            {user?.name || '用户'}
          </Title>
          <Text type="secondary" className={styles.subtitle}>
            {activeTab === 'profile' ? '个人资料管理' : '系统设置'}
          </Text>
        </div>

        <div className={styles.tabContainer}>
          <Space className={styles.tabButtons}>
            <Button 
              type={activeTab === 'profile' ? 'primary' : 'default'}
              icon={<UserOutlined />}
              onClick={() => setActiveTab('profile')}
            >
              个人资料
            </Button>
            <Button 
              type={activeTab === 'settings' ? 'primary' : 'default'}
              icon={<SettingOutlined />}
              onClick={() => setActiveTab('settings')}
            >
              系统设置
            </Button>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={getInitialValues()}
          onFinish={handleSubmit}
        >
          {activeTab === 'profile' ? (
            <>
              <Title level={4} className={styles.sectionTitle}>基本信息</Title>
              <UserNameField name="name" label="用户名" rules={[{ required: true, message: '请输入用户名' }]} />
              <EmailField name="email" label="邮箱" />
              <PhoneField name="phone" label="手机号" />
              <TextAreaField name="bio" label="个人简介" rows={4} placeholder="请输入个人简介" />
            </>
          ) : (
            <>
              <Card size="small" className={styles.sectionCard}>
                <Title level={4} className={styles.sectionTitle}>
                  <BellOutlined className={styles.sectionIcon} />
                  通知设置
                </Title>
                <SwitchField name="notifications" label="启用通知" />
                <SwitchField name="emailNotifications" label="邮件通知" />
              </Card>

              <Card size="small" className={styles.sectionCard}>
                <Title level={4} className={styles.sectionTitle}>
                  <GlobalOutlined className={styles.sectionIcon} />
                  界面设置
                </Title>
                <SelectField name="language" label="语言" options={settingsFormItems[2].options} />
                <SelectField name="theme" label="主题" options={settingsFormItems[3].options} />
              </Card>

              <Card size="small" className={styles.sectionCard}>
                <Title level={4} className={styles.sectionTitle}>
                  <SecurityScanOutlined className={styles.sectionIcon} />
                  功能设置
                </Title>
                <SwitchField name="autoSave" label="自动保存" />
                <SwitchField name="aiAssistant" label="AI助手" />
              </Card>
            </>
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
