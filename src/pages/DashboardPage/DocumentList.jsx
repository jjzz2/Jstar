import React, { useMemo } from 'react';
import { List, Empty } from 'antd';
import { ItemCard } from '../../components/Common';

const DocumentList = ({ documents, onEdit, onDelete }) => {
  const renderDocumentList = useMemo(() => {
    if (documents.length === 0) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无文档"
          style={{ marginTop: '50px' }}
        />
      );
    }

    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        dataSource={documents}
        renderItem={(doc) => (
          <List.Item>
            <ItemCard
              item={doc}
              type="document"
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onEdit}
            />
          </List.Item>
        )}
      />
    );
  }, [documents, onEdit, onDelete]);

  return renderDocumentList;
};

export default DocumentList;
