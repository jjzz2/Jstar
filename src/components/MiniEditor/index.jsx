import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './styles.module.css';

const MiniEditorWrapper = forwardRef(({ initialContent = '', onChange, placeholder = '开始输入...' }, ref) => {
  const iframeRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = React.useState(false);

  // 编辑器 URL - 指向构建好的 Vue 编辑器
  const editorUrl = '/editor/index.html';

  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Received message:', event.data);
      // 安全校验：确保消息来自我们自己的 iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }
      const { event: eventName, payload } = event.data;
      switch (eventName) {
        case 'editorReady':
          console.log('Editor is ready!');
          setIsEditorReady(true);
          // 设置初始内容
          if (initialContent) {
            iframeRef.current?.contentWindow?.postMessage({
              action: 'setContent',
              content: initialContent
            }, '*');
          }
          break;
        case 'contentChanged':
          if (onChange) {
            onChange(payload);
          }
          break;
        default:
          break;
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onChange, initialContent]);

  // 添加 iframe 加载监听
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        console.log('Iframe loaded');
        // 发送初始化消息
        iframe.contentWindow?.postMessage({
          action: 'init',
          placeholder: placeholder
        }, '*');
      };
      
      iframe.addEventListener('load', handleLoad);
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [placeholder]);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    getContent: () => {
      return new Promise((resolve) => {
        const handleMessage = (event) => {
          if (event.source !== iframeRef.current?.contentWindow) return;
          if (event.data.action === 'getContent') {
            window.removeEventListener('message', handleMessage);
            resolve(event.data.content);
          }
        };
        window.addEventListener('message', handleMessage);
        iframeRef.current?.contentWindow?.postMessage({
          action: 'getContent'
        }, '*');
      });
    },
    setContent: (content) => {
      iframeRef.current?.contentWindow?.postMessage({
        action: 'setContent',
        content: content
      }, '*');
    },
    getText: () => {
      return new Promise((resolve) => {
        const handleMessage = (event) => {
          if (event.source !== iframeRef.current?.contentWindow) return;
          if (event.data.action === 'getText') {
            window.removeEventListener('message', handleMessage);
            resolve(event.data.text);
          }
        };
        window.addEventListener('message', handleMessage);
        iframeRef.current?.contentWindow?.postMessage({
          action: 'getText'
        }, '*');
      });
    },
    isEmpty: () => {
      return new Promise((resolve) => {
        const handleMessage = (event) => {
          if (event.source !== iframeRef.current?.contentWindow) return;
          if (event.data.action === 'isEmpty') {
            window.removeEventListener('message', handleMessage);
            resolve(event.data.isEmpty);
          }
        };
        window.addEventListener('message', handleMessage);
        iframeRef.current?.contentWindow?.postMessage({
          action: 'isEmpty'
        }, '*');
      });
    },
    focus: () => {
      iframeRef.current?.contentWindow?.postMessage({
        action: 'focus'
      }, '*');
    }
  }));

  return (
    <div className={styles.editorContainer}>
      <iframe
        ref={iframeRef}
        src={editorUrl}
        className={styles.editorIframe}
        title="Mini Editor"
      />
    </div>
  );
});

MiniEditorWrapper.displayName = 'MiniEditorWrapper';

export default MiniEditorWrapper;
