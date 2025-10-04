import React from 'react';
import { Input, Button, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styles from './styles.module.css';

const { TextArea } = Input;

const ChatInput = ({ 
  inputValue, 
  setInputValue, 
  onSendMessage, 
  onKeyPress, 
  loading 
}) => {
  return (
    <div className={styles.inputContainer}>
      <Space.Compact className={styles.inputGroup}>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="输入你的问题..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          className={styles.textArea}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={onSendMessage}
          loading={loading}
          disabled={!inputValue.trim()}
          className={styles.sendButton}
        >
          发送
        </Button>
      </Space.Compact>
    </div>
  );
};

export default ChatInput;
