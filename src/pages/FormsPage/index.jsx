import React, { useCallback, useMemo } from 'react';
import { 
  Typography, 
  Button, 
  message,
  Empty,
  Spin,
  List
} from 'antd';
import { 
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useForms } from '../../hooks';
import { ItemCard } from '../../components/Common';

const { Title } = Typography;

const FormsPage = () => {
  const navigate = useNavigate();

  // 使用自定义hook管理表单
  const {
    forms,
    loading,
    handleCreateForm,
    handleDeleteForm
  } = useForms();

  // 处理创建表单
  const handleCreate = useCallback(async () => {
    try {
      const result = await handleCreateForm({
        title: '新建表单',
        description: '',
        type: 'FORM'
      });
      
      message.success('表单创建成功');
      navigate(`/forms/${result.data.id}`);
    } catch (error) {
      message.error('创建表单失败');
    }
  }, [handleCreateForm, navigate]);

  // 处理删除表单
  const handleDelete = useCallback(async (form) => {
    try {
      await handleDeleteForm(form.id);
      message.success('表单已删除');
    } catch (error) {
      message.error('删除表单失败');
    }
  }, [handleDeleteForm]);

  // 处理编辑表单
  const handleEdit = useCallback((form) => {
    navigate(`/forms/${form.id}`);
  }, [navigate]);

  // 渲染表单列表
  const renderFormList = useMemo(() => {
    if (forms.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无表单"
          style={{ marginTop: '50px' }}
        />
      );
    }

    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        dataSource={forms}
        renderItem={(form) => (
          <List.Item>
            <ItemCard
              item={form}
              type="form"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleEdit}
            />
          </List.Item>
        )}
      />
    );
  }, [forms, handleEdit, handleDelete]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>正在加载表单列表...</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '64px', padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>我的表单</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          新建表单
        </Button>
      </div>

      {renderFormList}
    </div>
  );
};

export default FormsPage;