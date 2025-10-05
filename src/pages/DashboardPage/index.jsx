import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../../hooks';
import { message, Spin } from 'antd';
import PageHeader from './PageHeader';
import DocumentList from './DocumentList';
import CreateDocumentModal from './CreateDocumentModal';

const DashboardPage = ({ searchTerm = '' }) => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newDocTitle, setNewDocTitle] = useState('');

    // 使用自定义hook管理文档，排除本地文件
    const {
        documents,
        loading,
        error,
        handleCreateDocument,
        handleDeleteDocument,
        refreshDocuments
    } = useDocuments({ searchTerm, excludeLocalFiles: true });

    // 处理创建文档
    const handleCreate = useCallback(async () => {
        console.log('handleCreate 被调用', { newDocTitle, loading });
        
        if (!newDocTitle.trim()) {
            message.error('请输入文档标题');
            return;
        }

        try {
            console.log('开始创建文档...');
            const result = await handleCreateDocument({
                title: newDocTitle.trim(),
                content: '',
                type: 'DOC'
            });
            
            console.log('文档创建成功:', result);
            message.success('文档创建成功');
            setIsModalVisible(false);
            setNewDocTitle('');
            navigate(`/docs/${result.data.id}`);
        } catch (error) {
            console.error('创建文档失败:', error);
            console.error('错误详情:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data
            });
            
            // 根据错误类型显示不同的错误信息
            if (error.response?.status === 500) {
                message.error('服务器内部错误，请稍后重试');
            } else if (error.response?.status === 400) {
                message.error('请求参数错误，请检查输入');
            } else {
                message.error(`创建文档失败: ${error.message}`);
            }
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

    // 处理打开创建文档模态框
    const handleOpenCreateModal = useCallback(() => {
        setIsModalVisible(true);
    }, []);

    // 处理关闭创建文档模态框
    const handleCloseCreateModal = useCallback(() => {
        setIsModalVisible(false);
        setNewDocTitle('');
    }, []);

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
            <PageHeader onCreateDocument={handleOpenCreateModal} />

            <DocumentList 
                documents={documents}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CreateDocumentModal
                visible={isModalVisible}
                onCancel={handleCloseCreateModal}
                onOk={handleCreate}
                title={newDocTitle}
                onTitleChange={setNewDocTitle}
            />
        </div>
    );
};

export default DashboardPage;