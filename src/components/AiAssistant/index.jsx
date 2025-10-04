import React, { useState, useRef, useEffect } from 'react';
import { 
  FloatButton, 
  Drawer, 
  Button, 
  Avatar,
  Spin,
  message
} from 'antd';
import { SmartRobotIcon } from '../IconFont';
import { apiClient } from '../../api';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeMessage from './WelcomeMessage';
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

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', {
        prompt: userMessage.content,
        context: documentContext
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI聊天失败:', error);
      message.error('AI助手暂时不可用，请稍后再试');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '抱歉，我现在无法回答您的问题。请稍后再试。',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
            onSendMessage={sendMessage}
            onKeyPress={handleKeyPress}
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
