import React from 'react';
import { Form, Input, Select, Switch, Button, Space, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './styles.module.css';

const { Option } = Select;
const { Text } = Typography;

const FormField = ({ 
  type = 'input',
  name,
  label,
  rules = [],
  placeholder,
  prefix,
  options = [],
  valuePropName,
  ...props 
}) => {
  const getPrefixIcon = () => {
    const iconMap = {
      user: <UserOutlined />,
      email: <MailOutlined />,
      phone: <PhoneOutlined />,
      password: <LockOutlined />,
      setting: <SettingOutlined />
    };
    return iconMap[prefix] || null;
  };

  const renderField = () => {
    const commonProps = {
      placeholder,
      prefix: getPrefixIcon(),
      ...props
    };

    switch (type) {
      case 'password':
        return <Input.Password {...commonProps} />;
      
      case 'textarea':
        return <Input.TextArea {...commonProps} />;
      
      case 'select':
        return (
          <Select {...commonProps}>
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      
      case 'switch':
        return <Switch {...commonProps} />;
      
      case 'input':
      default:
        return <Input {...commonProps} />;
    }
  };

  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      valuePropName={valuePropName}
      className={styles.formField}
    >
      {renderField()}
    </Form.Item>
  );
};

// 预定义的常用表单字段组件
export const UserNameField = (props) => (
  <FormField
    type="input"
    prefix="user"
    placeholder="请输入用户名"
    {...props}
  />
);

export const EmailField = (props) => (
  <FormField
    type="input"
    prefix="email"
    placeholder="请输入邮箱"
    rules={[
      { required: true, message: '请输入邮箱' },
      { type: 'email', message: '请输入有效的邮箱地址' }
    ]}
    {...props}
  />
);

export const PhoneField = (props) => (
  <FormField
    type="input"
    prefix="phone"
    placeholder="请输入手机号"
    {...props}
  />
);

export const PasswordField = (props) => (
  <FormField
    type="password"
    prefix="password"
    placeholder="请输入密码"
    rules={[
      { required: true, message: '请输入密码' },
      { min: 6, message: '密码至少6个字符' }
    ]}
    {...props}
  />
);

export const ConfirmPasswordField = (props) => (
  <FormField
    type="password"
    prefix="password"
    placeholder="请确认密码"
    rules={[
      { required: true, message: '请确认密码' },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('两次输入的密码不一致'));
        },
      }),
    ]}
    {...props}
  />
);

export const SwitchField = (props) => (
  <FormField
    type="switch"
    valuePropName="checked"
    {...props}
  />
);

export const SelectField = (props) => (
  <FormField
    type="select"
    {...props}
  />
);

export const TextAreaField = (props) => (
  <FormField
    type="textarea"
    {...props}
  />
);

export default FormField;
