import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Upload, Button, message } from 'antd';
import { HomeOutlined, DeleteOutlined, FormOutlined, UploadOutlined, FileOutlined } from '@ant-design/icons';
import { openLocalFile } from '../../services/fileService';
import styles from './styles.module.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const menuItems = [
    {
      key: '/docs',
      icon: <HomeOutlined />,
      label: '我的文档',
    },
    {
      key: '/local-files',
      icon: <FileOutlined />,
      label: '本地文件',
    },
    {
      key: '/forms',
      icon: <FormOutlined />,
      label: '我的表单',
    },
    {
      key: '/trash',
      icon: <DeleteOutlined />,
      label: '回收站',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleFileOpen = async (file) => {
    setUploading(true);
    try {
      const result = await openLocalFile(file);
      message.success('文件打开成功！');
      // 打开成功后跳转到文档编辑器
      navigate(`/docs/${result.documentId}`);
    } catch (error) {
      message.error('文件打开失败：' + error.message);
    } finally {
      setUploading(false);
    }
    return false; // 阻止默认上传行为
  };

  const uploadProps = {
    beforeUpload: handleFileOpen,
    showUploadList: false,
    accept: '.txt,.md,.doc,.docx,.pdf',
  };

  return (
    <div className={styles.sidebarContainer}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className={styles.sidebar}
      />
      <div className={styles.uploadSection}>
        <Upload {...uploadProps}>
          <Button 
            type="primary" 
            icon={<UploadOutlined />} 
            loading={uploading}
            block
            className={styles.uploadButton}
          >
            {uploading ? '打开中...' : '打开本地文档'}
          </Button>
        </Upload>
      </div>
    </div>
  );
};

export default Sidebar;

