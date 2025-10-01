import React, { useEffect, useState } from 'react';
import { api } from '../api';

const TrashPage = () => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const list = await api.fetchDocumentList(true);
      setDocs(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = '回收站';
    load();
  }, []);

  const restoreDoc = async (id) => {
    try {
      await api.updateDocumentTrashed(id, false);
      await load();
    } catch (e) {
      console.error(e);
      alert('恢复失败');
    }
  };

  const deleteForever = async (id) => {
    const confirmed = window.confirm('确定要永久删除吗？此操作不可恢复。');
    if (!confirmed) return;
    try {
      await api.deleteDocument(id);
      await load();
    } catch (e) {
      console.error(e);
      alert('删除失败');
    }
  };

  if (isLoading) {
    return <div className="page"><h1>正在加载回收站...</h1></div>;
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>回收站</h1>
      </header>
      {docs.length === 0 ? (
        <div>回收站为空</div>
      ) : (
        <ul className="doc-list">
          {docs.map(doc => (
            <li key={doc.id}>
              <span style={{ fontWeight: 500 }}>{doc.title}</span>
              {' '}
              <span style={{ color: '#6c757d', fontSize: 14 }}>
                · 最后更新：{new Date(doc.lastUpdated).toLocaleString()}
              </span>
              {' '}
              <button className="restore-doc-btn" onClick={() => restoreDoc(doc.id)} style={{ marginLeft: 12 }}>恢复</button>
              <button className="delete-doc-btn" onClick={() => deleteForever(doc.id)} style={{ marginLeft: 8 }}>永久删除</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrashPage;


