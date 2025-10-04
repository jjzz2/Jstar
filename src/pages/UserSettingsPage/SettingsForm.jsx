import React from 'react';
import { Card, Typography } from 'antd';
import { BellOutlined, GlobalOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { SwitchField, SelectField } from '../../components/Common';

const { Title } = Typography;

const SettingsForm = () => {
  const notificationOptions = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'en-US', label: 'English' }
  ];

  const themeOptions = [
    { value: 'light', label: '浅色主题' },
    { value: 'dark', label: '深色主题' },
    { value: 'auto', label: '跟随系统' }
  ];

  return (
    <>
      <Card size="small" className="section-card">
        <Title level={4} className="section-title">
          <BellOutlined className="section-icon" />
          通知设置
        </Title>
        <SwitchField name="notifications" label="启用通知" />
        <SwitchField name="emailNotifications" label="邮件通知" />
      </Card>

      <Card size="small" className="section-card">
        <Title level={4} className="section-title">
          <GlobalOutlined className="section-icon" />
          界面设置
        </Title>
        <SelectField name="language" label="语言" options={notificationOptions} />
        <SelectField name="theme" label="主题" options={themeOptions} />
      </Card>

      <Card size="small" className="section-card">
        <Title level={4} className="section-title">
          <SecurityScanOutlined className="section-icon" />
          功能设置
        </Title>
        <SwitchField name="autoSave" label="自动保存" />
        <SwitchField name="aiAssistant" label="AI助手" />
      </Card>
    </>
  );
};

export default SettingsForm;
