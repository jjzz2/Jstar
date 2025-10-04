import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { SmartRobotIcon } from '../IconFont';
import styles from './styles.module.css';

const { Text } = Typography;

const ChatMessage = ({ message, formatTime }) => {
  return (
    <div className={`${styles.message} ${styles[message.type]}`}>
      <div className={styles.messageHeader}>
        <Avatar 
          size="small" 
          icon={message.type === 'user' ? <UserOutlined /> : <SmartRobotIcon />}
          className={styles.messageAvatar}
        />
        <Text type="secondary" className={styles.messageTime}>
          {formatTime(message.timestamp)}
        </Text>
      </div>
      <div className={styles.messageContent}>
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
