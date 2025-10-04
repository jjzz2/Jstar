import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../../hooks';
import { ItemCard } from '../../components/Common';
import { 
  Button, 
  Typography, 
  Modal, 
  Input, 
  message,
  List,
  Empty,
  Spin
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const DashboardPage = ({ searchTerm = '' }) => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newDocTitle, setNewDocTitle] = useState('');

    // 使用自定义hook管理文档
    const {
        documents,
        loading,
        error,
        handleCreateDocument,
        handleDeleteDocument,
        refreshDocuments
    } = useDocuments({ searchTerm });

    // 处理创建文档
    const handleCreate = useCallback(async () => {
        if (!newDocTitle.trim()) {
            message.error('请输入文档标题');
            return;
        }

        try {
            const result = await handleCreateDocument({
                title: newDocTitle.trim(),
                content: '',
                type: 'DOC'
            });
            
            message.success('文档创建成功');
            setIsModalVisible(false);
            setNewDocTitle('');
            navigate(`/docs/${result.data.id}`);
        } catch (error) {
            message.error('创建文档失败');
        }
    }, [newDocTitle, handleCreateDocument, navigate]);

    // 处理删除文档
    const handleDelete = useCallback(async (doc) => {
        try {
            await handleDeleteDocument(doc.id);
            message.success('文档已删除');
        } catch (error) {
            message.error('删除文档失败');
        }
    }, [handleDeleteDocument]);

    // 处理编辑文档
    const handleEdit = useCallback((doc) => {
        navigate(`/docs/${doc.id}`);
    }, [navigate]);

    // 渲染文档列表
    const renderDocumentList = useMemo(() => {
        if (documents.length === 0) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无文档"
                    style={{ marginTop: '50px' }}
                />
            );
        }

        return (
            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
                dataSource={documents}
                renderItem={(doc) => (
                    <List.Item>
                        <ItemCard
                            item={doc}
                            type="document"
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleEdit}
                        />
                    </List.Item>
                )}
            />
        );
    }, [documents, handleEdit, handleDelete]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>正在加载文档列表...</div>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '64px', padding: '24px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>我的文档</Title>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    新建文档
                </Button>
            </div>

            {renderDocumentList}

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
                />
            </Modal>
        </div>
    );
};

export default DashboardPage;