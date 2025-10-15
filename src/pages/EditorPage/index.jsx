import React, { useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDebounceFn } from 'ahooks';
import MiniEditorWrapper from '../../components/MiniEditor';
import AiAssistant from '../../components/AiAssistant';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocById, updateDocContent } from '../../store/docsSlice';
import { ROUTES } from '../../router/routes';
import styles from './styles.module.css';

const EditorPage = () => {
    const { documentId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const doc = useSelector(s => s.docs.currentDoc);
    const currentStatus = useSelector(s => s.docs.currentStatus);
    const [saveStatus, setSaveStatus] = React.useState('已同步');

    useEffect(() => {
        document.title = "加载中...";
        console.log('EditorPage: Loading document with ID:', documentId);
        dispatch(fetchDocById({ id: documentId })).catch(error => {
            console.error('EditorPage: Failed to load document:', error);
        });
    }, [documentId, dispatch]);

    const saveContent = useCallback(async (newContent) => {
        setSaveStatus('正在保存...');
        await dispatch(updateDocContent({ id: documentId, content: newContent }));
        setSaveStatus('已同步');
    }, [documentId, dispatch]);

    const { run: debouncedSave } = useDebounceFn(saveContent, {
        wait: 1500,
    });

    const handleEditorChange = (newContent) => {
        setSaveStatus('待保存');
        debouncedSave(newContent);
    };

    if (currentStatus === 'loading' || !doc) {
        return <div className="page"><h1>正在加载编辑器...</h1></div>;
    }

    return (
        <div className="editor-layout">
            <header className="editor-header">
                <Link to="/" className="back-link">&larr; 返回文档列表</Link>
                <div className="save-status">{doc.title || '未命名文档'} · 状态: {saveStatus}</div>
                <button className="create-doc-btn" onClick={async () => {
                    setSaveStatus('正在保存...');
                    await dispatch(updateDocContent({ id: documentId, content: doc.content || '' }));
                    setSaveStatus('已同步');
                    navigate(ROUTES.HOME);
                }}>保存并退出</button>
            </header>
            <main className="editor-main">
                <MiniEditorWrapper
                    initialContent={doc.content || ''}
                    onChange={handleEditorChange}
                />
            </main>
            
            {/* AI Assistant with document context */}
            <AiAssistant documentContext={doc.content} />
        </div>
    );
};

export default EditorPage;


