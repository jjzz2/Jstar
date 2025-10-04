import React from 'react';
import { Card, Button, Space, Typography, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined, FormOutlined } from '@ant-design/icons';
import styles from './styles.module.css';

const { Title, Text } = Typography;

const ItemCard = ({ 
  item, 
  type = 'document', // 'document' | 'form'
  onEdit, 
  onDelete, 
  onView,
  showActions = true 
}) => {
  const getIcon = () => {
    return type === 'form' ? <FormOutlined /> : <FileTextOutlined />;
  };

  const getTypeTag = () => {
    return type === 'form' ? 
      <Tag color="blue">表单</Tag> : 
      <Tag color="green">文档</Tag>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card
      className={styles.card}
      hoverable
      actions={showActions ? [
        <Button 
          key="edit" 
          type="text" 
          icon={<EditOutlined />}
          onClick={() => onEdit?.(item)}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确定要删除吗？"
          onConfirm={() => onDelete?.(item)}
          okText="确定"
          cancelText="取消"
        >
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Popconfirm>
      ] : undefined}
    >
      <div className={styles.cardContent}>
        <div className={styles.header}>
          <div className={styles.icon}>
            {getIcon()}
          </div>
          <div className={styles.titleSection}>
            <Title level={5} className={styles.title}>
              {item.title}
            </Title>
            <div className={styles.meta}>
              {getTypeTag()}
              <Text type="secondary" className={styles.date}>
                {formatDate(item.lastUpdated)}
              </Text>
            </div>
          </div>
        </div>
        
        {item.description && (
          <Text type="secondary" className={styles.description}>
            {item.description}
          </Text>
        )}
        
        <div className={styles.footer}>
          <Space>
            <Button 
              type="primary" 
              size="small"
              onClick={() => onView?.(item)}
            >
              {type === 'form' ? '编辑表单' : '打开文档'}
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
