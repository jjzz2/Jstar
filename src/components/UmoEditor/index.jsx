import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './styles.module.css';
import { useEditorBridge } from './useEditorBridge';

const UmoEditor = forwardRef(({ initialContent = '', onChange }, ref) => {
  const iframeRef = useRef(null);
  
  // 指向我们构建并复制到 public 目录下的 Vue 编辑器
  const editorUrl = '/umo-editor-app/index.html';

  // 使用自定义 Hook 处理通信逻辑 (JS 版本)
  const { isReady, executeCommand } = useEditorBridge(iframeRef, {
    onContentChanged: onChange,
    onReady: () => {
      // 当编辑器准备好时，初始化内容
      if (initialContent) {
        executeCommand('setContent', initialContent, false).catch(console.error);
      }
    },
    timeout: 5000 // 5秒超时
  });

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    getContent: async () => {
      try {
        return await executeCommand('getContent');
      } catch (error) {
        console.error('Failed to get content:', error);
        throw error;
      }
    },
    setContent: (content) => {
      executeCommand('setContent', content).catch(console.error);
    },
    focus: () => {
      executeCommand('focus').catch(console.error);
    },
    blur: () => {
      executeCommand('blur').catch(console.error);
    }
  }));

  // 监听 initialContent 变化
  useEffect(() => {
    if (isReady && initialContent) {
      // 这里的逻辑可视需求调整，避免覆盖用户正在输入的内容
    }
  }, [isReady, initialContent]);

  return (
    <div className={styles.editorContainer}>
      {!isReady && (
        <div className={styles.loadingContainer}>
           <div className={styles.spinner}></div>
           <p>编辑器加载中...</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={editorUrl}
        className={styles.editorIframe}
        title="Umo Editor"
        style={{ visibility: isReady ? 'visible' : 'hidden' }}
      />
    </div>
  );
});

UmoEditor.displayName = 'UmoEditor';

export default UmoEditor;
