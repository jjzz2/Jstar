import React from 'react';
import { Typography, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PageHeader = ({ onCreateDocument }) => {
  return (
    <div style={{ 
      marginBottom: '24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <Title level={2} style={{ margin: 0 }}>我的文档</Title>
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={onCreateDocument}
      >
        新建文档
      </Button>
    </div>
  );
};

export default PageHeader;
