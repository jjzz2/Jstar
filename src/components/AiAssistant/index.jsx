import React, { useState, useRef, useEffect } from 'react';
import { 
  FloatButton, 
  Drawer, 
  Button, 
  Avatar,
  Spin
} from 'antd';
import { SmartRobotIcon } from '../IconFont';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeMessage from './WelcomeMessage';
import { sendMessage, createUserMessage, formatTime, handleKeyPress } from './sendMessage';
import styles from './styles.module.css';

const AiAssistant = ({ documentContext = null }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = createUserMessage(inputValue);
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    await sendMessage({
      userMessage: userMessage.content,
      documentContext,
      onSuccess: (aiMessage) => {
        setMessages(prev => [...prev, aiMessage]);
      },
      onError: (errorMessage) => {
        setMessages(prev => [...prev, errorMessage]);
      },
      onLoadingChange: setLoading
    });
  };

  const onKeyPress = (e) => {
    handleKeyPress(e, handleSendMessage);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      <FloatButton
        icon={<SmartRobotIcon />}
        onClick={() => setOpen(true)}
        className={styles.floatButton}
        tooltip="AI助手"
      />
      
      <Drawer
        title={
          <div className={styles.drawerTitle}>
            <SmartRobotIcon className={styles.titleIcon} />
            <span>AI助手</span>
          </div>
        }
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={400}
        className={styles.drawer}
      >
        <div className={styles.chatContainer}>
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <WelcomeMessage documentContext={documentContext} />
            ) : (
              messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  formatTime={formatTime}
                />
              ))
            )}
            
            {loading && (
              <div className={`${styles.message} ${styles.ai}`}>
                <div className={styles.messageHeader}>
                  <Avatar 
                    size="small" 
                    icon={<SmartRobotIcon />}
                    className={styles.messageAvatar}
                  />
                </div>
                <div className={styles.messageContent}>
                  <Spin size="small" />
                  <span className={styles.thinkingText}>
                    AI正在思考中...
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <ChatInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
            onKeyPress={onKeyPress}
            loading={loading}
          />
          
          {messages.length > 0 && (
            <div style={{ textAlign: 'center', padding: '8px' }}>
              <Button 
                type="link" 
                onClick={clearChat}
                className={styles.clearButton}
              >
                清空对话
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default AiAssistant;
