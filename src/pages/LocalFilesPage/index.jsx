import React from 'react';
import { List, Card, Button, Space, Typography, Tag, Popconfirm, Empty, Spin } from 'antd';
import { FileOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { fileService } from '../../services/fileService';
import ItemCard from '../../components/Common/ItemCard';
import styles from './styles.module.css';

const { Title } = Typography;

const LocalFilesPage = () => {
  const navigate = useNavigate();

  // 获取本地文件列表
  const { data: localFilesData, loading, refresh } = useRequest(
    () => fileService.getLocalFileDocuments(),
    {
      refreshDeps: [],
    }
  );

  const localFiles = Array.isArray(localFilesData?.data) ? localFilesData.data : [];

  const handleEdit = (file) => {
    navigate(`/docs/${file.id}`);
  };

  const handleDelete = async (file) => {
    try {
      await fileService.deleteFile(file.id);
      message.success('文件删除成功');
      refresh();
    } catch (error) {
      message.error('文件删除失败');
    }
  };

  const handleView = (file) => {
    navigate(`/docs/${file.id}`);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={2} className={styles.title}>
          本地文件
        </Title>
        <p className={styles.subtitle}>
          从本地打开的文件，共 {localFiles.length} 个
        </p>
      </div>

      {localFiles.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无本地文件"
          className={styles.empty}
        >
          <Button 
            type="primary" 
            icon={<UploadOutlined />}
            onClick={() => {
              // 触发文件选择
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.txt,.md,.doc,.docx,.pdf';
              input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                  try {
                    await fileService.openLocalFile(file);
                    message.success('文件打开成功！');
                    refresh();
                  } catch (error) {
                    message.error('文件打开失败：' + error.message);
                  }
                }
              };
              input.click();
            }}
          >
            打开本地文件
          </Button>
        </Empty>
      ) : (
        <div className={styles.fileList}>
          {localFiles.map((file) => (
            <ItemCard
              key={file.id}
              item={file}
              type="document"
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocalFilesPage;
