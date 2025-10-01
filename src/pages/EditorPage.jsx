import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import UmoEditor from '../components/UmoEditor';
import { api } from '../api';

const EditorPage = () => {
    const { documentId } = useParams();
    const [title, setTitle] = useState('');
    const [initialContent, setInitialContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState('已同步');
    
    // 用于存储防抖定时器
    const timeoutRef = useRef(null);

    // 初始加载文档内容
    useEffect(() => {
        setIsLoading(true);
        document.title = "加载中...";
        api.fetchDocument(documentId).then(doc => {
            setTitle(doc.title || '未命名文档');
            setInitialContent(doc.content || '');
            setIsLoading(false);
            document.title = `编辑文档 - ${doc.title || documentId}`;
        }).catch(err => {
            console.error(err);
            setInitialContent('<h1>文档加载失败！</h1>');
            setIsLoading(false);
        });
    }, [documentId]);

    // 使用 useCallback 创建一个记忆化的防抖保存函数
    const debouncedSave = useCallback((newContent) => {
        // 清除上一个定时器
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // 创建新的定时器
        timeoutRef.current = setTimeout(async () => {
            setSaveStatus('正在保存...');
            await api.updateDocument(documentId, newContent);
            setSaveStatus('已同步');
        }, 1500); // 停止输入 1.5 秒后自动保存
    }, [documentId]);

    // 编辑器内容变化时的回调函数
    const handleEditorChange = (newContent) => {
        setSaveStatus('待保存');
        debouncedSave(newContent);
    };

    if (isLoading) {
        return <div className="page"><h1>正在加载编辑器...</h1></div>;
    }

    return (
        <div className="editor-layout">
            <header className="editor-header">
                <Link to="/" className="back-link">&larr; 返回文档列表</Link>
                <div className="save-status">{title} · 状态: {saveStatus}</div>
            </header>
            <main className="editor-main">
                <UmoEditor
                    initialContent={initialContent}
                    onChange={handleEditorChange}
                />
            </main>
        </div>
    );
};

export default EditorPage;


