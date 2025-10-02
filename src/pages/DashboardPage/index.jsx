import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocs, createDoc, updateDocTrashed } from '../../store/docsSlice';
import AiAssistant from '../../components/AiAssistant';
import { 
  Table, 
  Button, 
  Space, 
  Typography, 
  Modal, 
  Input, 
  message,
  Popconfirm,
  Card,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  FileTextOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const DashboardPage = ({ searchTerm = '' }) => {
    const dispatch = useDispatch();
    const docs = useSelector(s => s.docs.list);
    const status = useSelector(s => s.docs.status);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [newDocTitle, setNewDocTitle] = React.useState('');

    const load = React.useCallback(async (search = '') => {
        await dispatch(fetchDocs({ trashed: false, search }));
    }, [dispatch]);

    useEffect(() => {
        document.title = "我的文档";
        load();
    }, [load]);

    useEffect(() => {
        load(searchTerm);
    }, [searchTerm, load]);

    if (status === 'loading') {
        return <div className="page"><h1>正在加载文件列表...</h1></div>;
    }

    const handleCreate = async () => {
        if (!newDocTitle.trim()) {
            message.error('请输入文档标题');
            return;
        }
        const res = await dispatch(createDoc({ title: newDocTitle.trim() }));
        if (res.meta.requestStatus === 'fulfilled') {
            message.success('文档创建成功');
            setIsModalVisible(false);
            setNewDocTitle('');
            navigate(`/docs/${res.payload.id}`);
        } else {
            message.error('文档创建失败');
        }
    };

    const handleDelete = async (id) => {
        const res = await dispatch(updateDocTrashed({ id, isTrashed: true }));
        if (res.meta.requestStatus === 'fulfilled') {
            message.success('文档已移入回收站');
            await load(searchTerm);
        } else {
            message.error('删除失败');
        }
    };

    const columns = [
        {
            title: '文档标题',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Space>
                    <FileTextOutlined style={{ color: record.type === 'FORM' ? '#52c41a' : '#1890ff' }} />
                    <Link to={record.type === 'FORM' ? `/forms/${record.id}` : `/docs/${record.id}`} style={{ fontWeight: 500 }}>
                        {text}
                    </Link>
                    {record.type === 'FORM' && (
                        <Tag color="green" size="small">表单</Tag>
                    )}
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
            filters: [
                { text: '文档', value: 'DOC' },
                { text: '表单', value: 'FORM' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: '最后更新',
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
                        icon={<EditOutlined />}
                        onClick={() => navigate(record.type === 'FORM' ? `/forms/${record.id}` : `/docs/${record.id}`)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要将该项目移入回收站吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button 
                            type="link" 
                            danger 
                            icon={<DeleteOutlined />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
            <Card 
                style={{ 
                    marginBottom: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                bodyStyle={{ padding: '20px 24px' }}
            >
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <div>
                        <Title level={2} style={{ margin: 0, marginBottom: '4px' }}>
                            我的工作台
                        </Title>
                        <Typography.Text type="secondary">
                            管理您的文档和表单
                        </Typography.Text>
                    </div>
                    <Space>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalVisible(true)}
                            size="large"
                        >
                            新建文档
                        </Button>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={docs}
                    rowKey="id"
                    loading={status === 'loading'}
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
            </Card>

            <Modal
                title="新建文档"
                open={isModalVisible}
                onOk={handleCreate}
                onCancel={() => {
                    setIsModalVisible(false);
                    setNewDocTitle('');
                }}
                okText="创建"
                cancelText="取消"
                width={400}
            >
                <Input
                    placeholder="请输入文档标题"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    onPressEnter={handleCreate}
                    autoFocus
                    size="large"
                />
            </Modal>
            
            {/* AI Assistant for general conversations */}
            <AiAssistant />
        </div>
    );
};

export default DashboardPage;


