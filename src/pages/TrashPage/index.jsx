import React, { useEffect, useState } from 'react';
import { docsService } from '../../services/docsService';
import { formsService } from '../../services/formsService';
import AiAssistant from '../../components/AiAssistant';
import { 
  Table, 
  Button, 
  Space, 
  Typography, 
  Empty,
  message,
  Popconfirm,
  Tag,
  Card
} from 'antd';
import { 
  AccountBookOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FormOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const TrashPage = () => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      // 获取被删除的文档和表单
      const [deletedDocs, deletedForms] = await Promise.all([
        docsService.fetchDocumentList(true),
        formsService.fetchFormList(true)
      ]);
      
      // 合并并添加类型标识
      const allItems = [
        ...deletedDocs.map(item => ({ ...item, type: 'DOC' })),
        ...deletedForms.map(item => ({ ...item, type: 'FORM' }))
      ];
      
      setDocs(allItems);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = '回收站';
    load();
  }, []);

  const restoreDoc = async (id, type) => {
    try {
      if (type === 'DOC') {
        await docsService.updateDocumentTrashed(id, false);
      } else {
        await formsService.updateFormTrashed(id, false);
      }
      message.success('已恢复');
      await load();
    } catch (e) {
      console.error(e);
      message.error('恢复失败');
    }
  };

  const deleteForever = async (id, type) => {
    try {
      if (type === 'DOC') {
        await docsService.deleteDocument(id);
      } else {
        await formsService.deleteForm(id);
      }
      message.success('已永久删除');
      await load();
    } catch (e) {
      console.error(e);
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '项目标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          {record.type === 'FORM' ? <FormOutlined style={{ color: '#52c41a' }} /> : <FileTextOutlined style={{ color: '#1890ff' }} />}
          <span style={{ fontWeight: 500 }}>{text}</span>
          <Tag color={record.type === 'FORM' ? 'green' : 'blue'}>
            {record.type === 'FORM' ? '表单' : '文档'}
          </Tag>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'FORM' ? 'green' : 'blue'}>
          {type === 'FORM' ? '表单' : '文档'}
        </Tag>
      ),
    },
    {
      title: '删除时间',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<AccountBookOutlined />}
            onClick={() => restoreDoc(record.id, record.type)}
          >
            恢复
          </Button>
          <Popconfirm
            title="确定要永久删除吗？"
            description="此操作不可恢复。"
            onConfirm={() => deleteForever(record.id, record.type)}
            okText="确定"
            cancelText="取消"
            okType="danger"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            >
              永久删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)', marginTop: '64px' }}>
      <Card 
        style={{ 
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        bodyStyle={{ padding: '20px 24px' }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, marginBottom: '4px' }}>
            回收站
          </Title>
          <Typography.Text type="secondary">
            管理已删除的文档和表单
          </Typography.Text>
        </div>

        {docs.length === 0 ? (
          <Empty 
            description="回收站为空"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={docs}
            rowKey="id"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个项目`,
              style: { 
                display: 'flex', 
                justifyContent: 'center',
                marginTop: '24px'
              }
            }}
            style={{
              background: '#fff',
              borderRadius: '8px'
            }}
          />
        )}
      </Card>
      
      {/* AI Assistant for general conversations */}
      <AiAssistant />
    </div>
  );
};

export default TrashPage;


