import React, { useEffect, useState } from 'react';
import { docsService } from '../../services/docsService';
import AiAssistant from '../../components/AiAssistant';
import { 
  Table, 
  Button, 
  Space, 
  Typography, 
  Empty,
  message,
  Popconfirm
} from 'antd';
import { 
  AccountBookOutlined ,RestoreOutlined,
  DeleteOutlined,
  FileTextOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const TrashPage = () => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const list = await docsService.fetchDocumentList(true);
      setDocs(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = '回收站';
    load();
  }, []);

  const restoreDoc = async (id) => {
    try {
      await docsService.updateDocumentTrashed(id, false);
      message.success('文档已恢复');
      await load();
    } catch (e) {
      console.error(e);
      message.error('恢复失败');
    }
  };

  const deleteForever = async (id) => {
    try {
      await docsService.deleteDocument(id);
      message.success('文档已永久删除');
      await load();
    } catch (e) {
      console.error(e);
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '文档标题',
      dataIndex: 'title',
      key: 'title',
      render: (text) => (
        <Space>
          <FileTextOutlined />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
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
            onClick={() => restoreDoc(record.id)}
          >
            恢复
          </Button>
          <Popconfirm
            title="确定要永久删除吗？"
            description="此操作不可恢复。"
            onConfirm={() => deleteForever(record.id)}
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
    <div>
      <Title level={2} style={{ marginBottom: 16 }}>
        回收站
      </Title>

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
            showTotal: (total) => `共 ${total} 个已删除文档`,
          }}
        />
      )}
      
      {/* AI Assistant for general conversations */}
      <AiAssistant />
    </div>
  );
};

export default TrashPage;


