import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

const DashboardPage = ({ searchTerm = '' }) => {
    const [docs, setDocs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const load = async (search = '') => {
        const list = await api.fetchDocumentList(false, search);
        setDocs(list);
    };

    useEffect(() => {
        document.title = "我的文档";
        load().finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        // update when search term changes
        load(searchTerm);
    }, [searchTerm]);

    if (isLoading) {
        return <div className="page"><h1>正在加载文件列表...</h1></div>;
    }

    const handleCreate = async () => {
        const title = window.prompt('请输入新文档标题：');
        if (!title) return;
        try {
            const newDoc = await api.createDocument(title);
            navigate(`/docs/${newDoc.id}`);
        } catch (e) {
            console.error(e);
            alert('创建文档失败');
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('确定要将该文档移入回收站吗？');
        if (!confirmed) return;
        try {
            await api.updateDocumentTrashed(id, true);
            await load();
        } catch (e) {
            console.error(e);
            alert('删除失败');
        }
    };

    return (
        <div className="page">
            <header className="page-header">
                <h1>我的文档</h1>
                <button className="create-doc-btn" onClick={handleCreate}>新建文档</button>
            </header>
            <ul className="doc-list">
                {docs.map(doc => (
                    <li key={doc.id}>
                        <Link to={`/docs/${doc.id}`}>{doc.title}</Link>
                        {' '}
                        <span style={{ color: '#6c757d', fontSize: 14 }}>
                            · 最后更新：{new Date(doc.lastUpdated).toLocaleString()}
                        </span>
                        {' '}
                        <button
                            className="delete-doc-btn"
                            onClick={() => handleDelete(doc.id)}
                            style={{ marginLeft: 12 }}
                        >
                            删除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardPage;


