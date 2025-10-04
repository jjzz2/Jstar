import React from 'react';
import { Typography } from 'antd';
import { SmartRobotIcon } from '../IconFont';
import styles from './styles.module.css';

const { Text } = Typography;

const WelcomeMessage = ({ documentContext }) => {
  return (
    <div className={styles.welcomeMessage}>
      <SmartRobotIcon className={styles.welcomeIcon} />
      <Text type="secondary">
        你好！我是你的AI助手，可以帮助你处理文档相关的问题。
        {documentContext && (
          <div className={styles.contextInfo}>
            当前文档：{documentContext.title}
          </div>
        )}
      </Text>
    </div>
  );
};

export default WelcomeMessage;
