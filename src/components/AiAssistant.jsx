import React, { useState, useRef, useEffect } from 'react';
import { 
  FloatButton, 
  Drawer, 
  Input, 
  Button, 
  Space, 
  Typography, 
  Avatar,
  Spin,
  message
} from 'antd';
import { 
  RobotOutlined, 
  SendOutlined, 
  UserOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { apiClient } from '../api';

const { TextArea } = Input;
const { Text } = Typography;

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
      console.error('AI chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: error.response?.data?.error || '抱歉，AI服务暂时不可用。请稍后再试。',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      message.error('AI服务请求失败');
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

  const renderMessage = (msg) => {
    const isUser = msg.type === 'user';
    return (
      <div 
        key={msg.id}
        style={{
          display: 'flex',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          marginBottom: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
          {!isUser && (
            <Avatar 
              icon={<RobotOutlined />} 
              style={{ 
                backgroundColor: msg.isError ? '#ff4d4f' : '#1890ff',
                marginRight: 8,
                flexShrink: 0
              }} 
            />
          )}
          <div
            style={{
              background: isUser ? '#1890ff' : (msg.isError ? '#fff2f0' : '#f6f6f6'),
              color: isUser ? '#fff' : '#000',
              padding: '8px 12px',
              borderRadius: '8px',
              border: msg.isError ? '1px solid #ffccc7' : 'none',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            <Text style={{ color: isUser ? '#fff' : (msg.isError ? '#ff4d4f' : '#000') }}>
              {msg.content}
            </Text>
            <div style={{ 
              fontSize: '11px', 
              opacity: 0.7, 
              marginTop: 4,
              color: isUser ? '#fff' : '#666'
            }}>
              {msg.timestamp.toLocaleTimeString()}
            </div>
          </div>
          {isUser && (
            <Avatar 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: '#52c41a',
                marginLeft: 8,
                flexShrink: 0
              }} 
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <FloatButton
        icon={<RobotOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={() => setOpen(true)}
        tooltip="AI 助手"
      />

      <Drawer
        title={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <RobotOutlined />
              <span>AI 助手</span>
              {documentContext && (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  (文档上下文模式)
                </Text>
              )}
            </Space>
            <Button 
              type="text" 
              size="small" 
              onClick={clearChat}
              disabled={messages.length === 0}
            >
              清空对话
            </Button>
          </Space>
        }
        placement="right"
        width={400}
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={<CloseOutlined />}
        styles={{
          body: { padding: 0 }
        }}
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Messages Area */}
          <div 
            style={{ 
              flex: 1, 
              padding: '16px', 
              overflowY: 'auto',
              maxHeight: 'calc(100vh - 200px)'
            }}
          >
            {messages.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#999', 
                marginTop: '50px' 
              }}>
                <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>你好！我是你的AI助手</div>
                <div style={{ fontSize: '12px', marginTop: '8px' }}>
                  {documentContext 
                    ? '我可以帮你分析当前文档内容，比如总结、翻译或语法检查'
                    : '有什么可以帮助你的吗？'
                  }
                </div>
              </div>
            ) : (
              messages.map(renderMessage)
            )}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    icon={<RobotOutlined />} 
                    style={{ backgroundColor: '#1890ff', marginRight: 8 }} 
                  />
                  <div style={{
                    background: '#f6f6f6',
                    padding: '8px 12px',
                    borderRadius: '8px'
                  }}>
                    <Spin size="small" />
                    <Text style={{ marginLeft: 8 }}>正在思考...</Text>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ 
            padding: '16px', 
            borderTop: '1px solid #f0f0f0',
            background: '#fafafa'
          }}>
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={documentContext 
                  ? "询问关于当前文档的问题..." 
                  : "输入你的问题..."
                }
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={loading}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                loading={loading}
                disabled={!inputValue.trim()}
              />
            </Space.Compact>
            {documentContext && (
              <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                提示：我可以看到当前文档的内容，可以帮你总结、翻译或检查语法
              </Text>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default AiAssistant;
