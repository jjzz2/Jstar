import React from 'react';
import { Modal, Input } from 'antd';

const CreateDocumentModal = ({ 
  visible, 
  onCancel, 
  onOk, 
  title, 
  onTitleChange 
}) => {
  return (
    <Modal
      title="新建文档"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="创建"
      cancelText="取消"
    >
      <Input
        placeholder="请输入文档标题"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        onPressEnter={onOk}
      />
    </Modal>
  );
};

export default CreateDocumentModal;
