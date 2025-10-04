import React from 'react';
import { Form, Typography } from 'antd';
import { UserNameField, EmailField, PhoneField, TextAreaField } from '../../components/Common';

const { Title } = Typography;

const ProfileForm = ({ form, onFinish }) => {
  return (
    <>
      <Title level={4} className="section-title">基本信息</Title>
      <UserNameField 
        name="name" 
        label="用户名" 
        rules={[{ required: true, message: '请输入用户名' }]} 
      />
      <EmailField name="email" label="邮箱" />
      <PhoneField name="phone" label="手机号" />
      <TextAreaField 
        name="bio" 
        label="个人简介" 
        rows={4} 
        placeholder="请输入个人简介" 
      />
    </>
  );
};

export default ProfileForm;
