import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

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
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              腾讯文档克隆
            </Title>
            <Text type="secondary">请登录您的账户</Text>
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
                style={{ width: '100%' }}
              >
                登录
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
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


