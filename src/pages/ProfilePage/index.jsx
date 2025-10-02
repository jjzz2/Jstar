import React from 'react';
import { Card, Form, Input, Button, Avatar, Typography, Space, Divider, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles.module.css';

const { Title, Text } = Typography;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [form] = Form.useForm();

  const handleUpdateProfile = (values) => {
    // 这里应该调用更新用户信息的API
    message.success('个人资料更新成功');
    console.log('Updated profile:', values);
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
            个人资料管理
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: user?.name || '',
            email: 'user@example.com',
            phone: '138****8888',
            bio: '这是一个示例用户简介'
          }}
          onFinish={handleUpdateProfile}
        >
          <Title level={4} className={styles.sectionTitle}>基本信息</Title>
          
          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
            />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />}
              placeholder="请输入邮箱"
            />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
          >
            <Input 
              prefix={<PhoneOutlined />}
              placeholder="请输入手机号"
            />
          </Form.Item>

          <Form.Item
            label="个人简介"
            name="bio"
          >
            <Input.TextArea 
              rows={4}
              placeholder="请输入个人简介"
            />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<EditOutlined />}
              size="large"
              className={styles.submitButton}
            >
              更新资料
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
