import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Typography, Alert, Space, message, Tabs } from 'antd';
import { loginUser } from '../../store/authSlice';
import { UserNameField, EmailField, PasswordField, ConfirmPasswordField } from '../../components/Common';
import styles from './styles.module.css';

const { Title, Text } = Typography;

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, status, error } = useSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState('login');

  if (isLoggedIn) return <Navigate to="/" replace />;

  const handleLogin = async (values) => {
    try {
      await dispatch(loginUser({ username: values.username, password: values.password }));
      navigate('/');
    } catch (error) {
      message.error('登录失败，请重试');
    }
  };

  const handleRegister = async (values) => {
    try {
      // 这里应该调用注册API
      message.success('注册成功！请登录');
      setActiveTab('login');
    } catch (error) {
      message.error('注册失败，请重试');
    }
  };


  const tabItems = [
    {
      key: 'login',
      label: '登录',
      children: (
        <Form
          name="login"
          onFinish={handleLogin}
          size="large"
          autoComplete="off"
        >
          <UserNameField name="username" rules={[{ required: true, message: '请输入用户名!' }]} />
          <PasswordField name="password" rules={[{ required: true, message: '请输入密码!' }]} />

          {status === 'failed' && (
            <Form.Item>
              <Alert
                message={error || '登录失败'}
                type="error"
                showIcon
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={status === 'loading'}
              className={styles.submitButton}
              block
            >
              登录
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            <Text type="secondary">
              没有账户？ <Link to="#" onClick={() => setActiveTab('register')}>立即注册</Link>
            </Text>
          </div>
        </Form>
      )
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <Form
          name="register"
          onFinish={handleRegister}
          size="large"
          autoComplete="off"
        >
          <UserNameField 
            name="username" 
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' }
            ]} 
          />
          <EmailField 
            name="email" 
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]} 
          />
          <PasswordField 
            name="password" 
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' }
            ]} 
          />
          <ConfirmPasswordField name="confirmPassword" />

          {status === 'failed' && (
            <Form.Item>
              <Alert
                message={error || '注册失败'}
                type="error"
                showIcon
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={status === 'loading'}
              className={styles.submitButton}
              block
            >
              注册
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            <Text type="secondary">
              已有账户？ <Link to="#" onClick={() => setActiveTab('login')}>立即登录</Link>
            </Text>
          </div>
        </Form>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className={styles.header}>
            <Title level={2} className={styles.title}>
              腾讯文档克隆
            </Title>
            <Text type="secondary" className={styles.subtitle}>
              {activeTab === 'login' ? '请登录您的账户' : '创建您的新账户'}
            </Text>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            centered
            className={styles.tabs}
          />

          {activeTab === 'login' && (
            <div className={styles.testAccount}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                测试账号: admin / password
              </Text>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default AuthPage;
