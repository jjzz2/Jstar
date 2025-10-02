import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './styles.module.css';

const { Title, Text } = Typography;

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, status, error } = useSelector(s => s.auth);

  if (isLoggedIn) return <Navigate to="/" replace />;

  const onFinish = async (values) => {
    const res = await dispatch(loginUser(values));
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className={styles.header}>
            <Title level={2} className={styles.title}>
              腾讯文档克隆
            </Title>
            <Text type="secondary" className={styles.subtitle}>
              请登录您的账户
            </Text>
          </div>

          <Form
            name="login"
            initialValues={{
              username: 'admin',
              password: 'password'
            }}
            onFinish={onFinish}
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

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
              >
                登录
              </Button>
            </Form.Item>

            <div className={styles.footer}>
              <Text type="secondary">
                没有账户？ <Link to="/register">立即注册</Link>
              </Text>
              <br />
              <Text type="secondary" className={styles.testAccount}>
                测试账号：admin / password
              </Text>
            </div>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default LoginPage;
