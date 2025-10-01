import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';

const UmoEditor = forwardRef(({ initialContent = '', onChange }, ref) => {
  const iframeRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // 此路径指向 public 文件夹下的 Umo Editor 应用
  const editorUrl = '/umo-editor-app/index.html';

  useEffect(() => {
    const handleMessage = (event) => {
      // 安全校验：确保消息来自我们自己的 iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }
      const { event: eventName, payload } = event.data;
      switch (eventName) {
        case 'editorReady':
          setIsEditorReady(true);
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
  }, [onChange]);

  // 当编辑器准备好后，把初始内容设置进去
  useEffect(() => {
    if (isEditorReady && initialContent) {
      // 第二个参数 false 表示不触发 update 事件，避免不必要的 onChange 回调
      callEditorMethod('setContent', [initialContent, false]);
    }
  }, [isEditorReady, initialContent]);

  // 封装调用编辑器方法的函数
  const callEditorMethod = (method, args = []) => {
    iframeRef.current?.contentWindow?.postMessage({
      action: 'callMethod',
      method: method,
      args: args,
    }, '*'); // 生产环境建议指定确切的 origin
  };

  // 暴露给父组件的 ref 方法
  useImperativeHandle(ref, () => ({
    setContent: (newContent) => callEditorMethod('setContent', [newContent]),
    focus: () => callEditorMethod('focus'),
  }));

  return (
    <iframe
      ref={iframeRef}
      src={editorUrl}
      title="Umo Editor"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
});

export default UmoEditor;


