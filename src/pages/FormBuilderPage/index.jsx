import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { loadFormData, saveFormData } from '../../store/formBuilderSlice';
import LeftPanel from './LeftPanel';
import EditCanvas from './EditCanvas';
import RightPanel from './RightPanel';
import styles from './styles.module.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const FormBuilderPage = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { componentList, pageInfo, loading, selectedId } = useSelector(state => state.formBuilder);

  useEffect(() => {
    if (formId) {
      dispatch(loadFormData(formId));
    }
  }, [formId, dispatch]);

  const handleSave = async () => {
    const formData = {
      title: pageInfo.title,
      description: pageInfo.desc,
      questions: componentList,
    };
    
    try {
      await dispatch(saveFormData({ formId, formData }));
      navigate('/');
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

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
            onClick={() => navigate('/')}
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
          onClick={handleSave}
          loading={loading}
        >
          保存
        </Button>
      </Header>

      <Layout>
        {/* Left Panel - Component Library */}
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

        {/* Center - Canvas */}
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

        {/* Right Panel - Properties */}
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

export default FormBuilderPage;
