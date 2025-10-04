import React from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LeftPanel from './LeftPanel';
import EditCanvas from './EditCanvas';
import RightPanel from './RightPanel';
import { ROUTES } from '../../router/routes';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const FormBuilderLayout = ({ onSave, loading }) => {
  const navigate = useNavigate();
  const { pageInfo } = useSelector(state => state.formBuilder);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(ROUTES.HOME)}
          >
            返回
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {pageInfo.title || '未命名表单'}
          </Title>
        </Space>
        
        <Button 
          type="primary" 
          icon={<SaveOutlined />}
          onClick={onSave}
          loading={loading}
        >
          保存
        </Button>
      </Header>

      <Layout>
        <Sider 
          width={300} 
          style={{ 
            background: '#fff', 
            borderRight: '1px solid #f0f0f0',
            overflow: 'auto'
          }}
        >
          <LeftPanel />
        </Sider>

        <Content style={{ 
          background: '#f5f5f5',
          padding: '24px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ 
            background: '#fff', 
            minHeight: 'calc(100vh - 200px)',
            width: '100%',
            maxWidth: '800px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <EditCanvas />
          </div>
        </Content>

        <Sider 
          width={300} 
          style={{ 
            background: '#fff', 
            borderLeft: '1px solid #f0f0f0',
            overflow: 'auto'
          }}
        >
          <RightPanel />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default FormBuilderLayout;
