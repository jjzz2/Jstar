import React from 'react';
import { Card, Form, Switch, Select, Input, Button, Typography, Divider, message, Space } from 'antd';
import { SettingOutlined, BellOutlined, SecurityScanOutlined, GlobalOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import styles from './styles.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

const SettingsPage = () => {
  const { user } = useSelector(state => state.auth);

  const handleSettingsChange = (values) => {
    message.success('设置已保存');
    console.log('Settings updated:', values);
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Title level={3} className={styles.title}>
            <SettingOutlined className={styles.icon} />
            系统设置
          </Title>
          <Text type="secondary" className={styles.subtitle}>
            管理您的应用偏好设置
          </Text>
        </div>

        <Form
          layout="vertical"
          initialValues={{
            notifications: true,
            emailNotifications: false,
            language: 'zh-CN',
            theme: 'light',
            autoSave: true,
            aiAssistant: true
          }}
          onFinish={handleSettingsChange}
        >
          {/* 通知设置 */}
          <Card size="small" className={styles.sectionCard}>
            <Title level={4} className={styles.sectionTitle}>
              <BellOutlined className={styles.sectionIcon} />
              通知设置
            </Title>
            
            <Form.Item
              label="启用通知"
              name="notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="邮件通知"
              name="emailNotifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>

          {/* 界面设置 */}
          <Card size="small" className={styles.sectionCard}>
            <Title level={4} className={styles.sectionTitle}>
              <GlobalOutlined className={styles.sectionIcon} />
              界面设置
            </Title>
            
            <Form.Item
              label="语言"
              name="language"
            >
              <Select>
                <Option value="zh-CN">简体中文</Option>
                <Option value="en-US">English</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="主题"
              name="theme"
            >
              <Select>
                <Option value="light">浅色主题</Option>
                <Option value="dark">深色主题</Option>
                <Option value="auto">跟随系统</Option>
              </Select>
            </Form.Item>
          </Card>

          {/* 功能设置 */}
          <Card size="small" className={styles.sectionCard}>
            <Title level={4} className={styles.sectionTitle}>
              <SecurityScanOutlined className={styles.sectionIcon} />
              功能设置
            </Title>
            
            <Form.Item
              label="自动保存"
              name="autoSave"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="AI助手"
              name="aiAssistant"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>

          <Divider />

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
                size="large"
              >
                保存设置
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

export default SettingsPage;
