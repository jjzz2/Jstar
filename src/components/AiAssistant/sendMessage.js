import { apiClient } from '../../api';
import { message } from 'antd';

/**
 * 发送消息到AI助手
 * @param {Object} params - 参数对象
 * @param {string} params.userMessage - 用户消息内容
 * @param {string} params.documentContext - 文档上下文
 * @param {Function} params.onSuccess - 成功回调函数
 * @param {Function} params.onError - 错误回调函数
 * @param {Function} params.onLoadingChange - 加载状态变化回调函数
 * @returns {Promise<Object>} AI回复消息对象
 */
export const sendMessage = async ({
  userMessage,
  documentContext = null,
  onSuccess,
  onError,
  onLoadingChange
}) => {
  if (!userMessage?.trim()) {
    throw new Error('消息内容不能为空');
  }

  // 设置加载状态
  onLoadingChange?.(true);

  try {
    // 调用AI API
    const response = await apiClient.post('/ai/chat', {
      prompt: userMessage.trim(),
      context: documentContext
    });

    // 创建AI回复消息对象
    const aiMessage = {
      id: Date.now() + Math.random(),
      type: 'ai',
      content: response.data.reply,
      timestamp: new Date()
    };

    // 调用成功回调
    onSuccess?.(aiMessage);

    return aiMessage;
  } catch (error) {
    console.error('AI聊天失败:', error);
    
    // 显示错误消息
    message.error('AI助手暂时不可用，请稍后再试');
    
    // 创建错误消息对象
    const errorMessage = {
      id: Date.now() + Math.random(),
      type: 'ai',
      content: '抱歉，我现在无法回答您的问题。请稍后再试。',
      timestamp: new Date()
    };

    // 调用错误回调
    onError?.(errorMessage);

    return errorMessage;
  } finally {
    // 重置加载状态
    onLoadingChange?.(false);
  }
};

/**
 * 创建用户消息对象
 * @param {string} content - 消息内容
 * @returns {Object} 用户消息对象
 */
export const createUserMessage = (content) => {
  return {
    id: Date.now() + Math.random(),
    type: 'user',
    content: content.trim(),
    timestamp: new Date()
  };
};

/**
 * 格式化时间戳
 * @param {Date|number} timestamp - 时间戳
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 处理键盘事件
 * @param {KeyboardEvent} event - 键盘事件
 * @param {Function} onSend - 发送消息回调函数
 */
export const handleKeyPress = (event, onSend) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    onSend();
  }
};
