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
  Popconfirm
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
                    <FileTextOutlined />
                    <Link to={`/docs/${record.id}`} style={{ fontWeight: 500 }}>
                        {text}
                    </Link>
                </Space>
            ),
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
                        onClick={() => navigate(`/docs/${record.id}`)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定要将该文档移入回收站吗？"
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
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>
                    我的文档
                </Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    新建文档
                </Button>
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
                    showTotal: (total) => `共 ${total} 个文档`,
                }}
            />

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
            >
                <Input
                    placeholder="请输入文档标题"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    onPressEnter={handleCreate}
                    autoFocus
                />
            </Modal>
            
            {/* AI Assistant for general conversations */}
            <AiAssistant />
        </div>
    );
};

export default DashboardPage;


