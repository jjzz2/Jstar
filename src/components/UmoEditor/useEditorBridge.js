import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * 生成简单的唯一 ID
 */
const generateId = () => Math.random().toString(36).substring(2, 15);

/**
 * useEditorBridge Hook (JS Version)
 * 封装 React <-> Iframe 通信逻辑
 * 
 * @param {React.RefObject} iframeRef - iframe 的 ref
 * @param {Object} options - 配置项
 * @param {Function} [options.onContentChanged] - 内容变化回调
 * @param {Function} [options.onReady] - 编辑器就绪回调
 * @param {number} [options.timeout=5000] - 请求超时时间 (ms)
 */
export const useEditorBridge = (iframeRef, options = {}) => {
  const { onContentChanged, onReady, timeout = 5000 } = options;
  const [isReady, setIsReady] = useState(false);
  
  // 存储待处理的请求 Promise resolve/reject 函数
  const pendingRequests = useRef(new Map());

  // 处理来自 iframe 的消息
  const handleMessage = useCallback((event) => {
    // 安全检查：确保消息来自当前 iframe
    if (iframeRef.current && event.source !== iframeRef.current.contentWindow) {
      return;
    }

    const data = event.data;
    if (!data || !data.action) return;

    // 处理方法调用结果 (Response)
    if (data.action === 'methodResult') {
      const request = pendingRequests.current.get(data.id);
      if (request) {
        if (data.error) {
          request.reject(new Error(data.error));
        } else {
          request.resolve(data.result);
        }
        pendingRequests.current.delete(data.id);
      }
    }

    // 处理事件 (Events)
    if (data.action === 'eventEmit' || data.event) {
      const eventName = data.event;
      
      if (eventName === 'editorReady') {
        setIsReady(true);
        if (onReady) onReady();
      } else if (eventName === 'contentChanged') {
        if (onContentChanged) onContentChanged(data.payload);
      }
    }
  }, [onContentChanged, onReady]);

  // 注册/注销消息监听
  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      // 清理所有挂起的请求
      pendingRequests.current.forEach((req) => req.reject(new Error('Component unmounted')));
      pendingRequests.current.clear();
    };
  }, [handleMessage]);

  /**
   * 执行编辑器命令
   * @param {string} method - 方法名
   * @param {...any} args - 参数列表
   * @returns {Promise<any>} 结果
   */
  const executeCommand = useCallback((method, ...args) => {
    if (!iframeRef.current?.contentWindow) {
      return Promise.reject(new Error('Editor iframe is not ready'));
    }

    const requestId = generateId();
    const request = {
      id: requestId,
      action: 'callMethod',
      method,
      args
    };

    // 发送消息
    iframeRef.current.contentWindow.postMessage(request, '*');

    // 创建 Promise 并设置超时
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (pendingRequests.current.has(requestId)) {
          pendingRequests.current.delete(requestId);
          reject(new Error(`Editor command "${method}" timed out after ${timeout}ms`));
        }
      }, timeout);

      pendingRequests.current.set(requestId, {
        resolve: (val) => {
          clearTimeout(timer);
          resolve(val);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        }
      });
    });
  }, [timeout]);

  return {
    isReady,
    executeCommand
  };
};
