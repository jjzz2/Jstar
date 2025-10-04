import { useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { documentApiUtils } from '../utils/api';
import { PAGINATION } from '../utils/constants';

/**
 * 文档管理自定义hook
 */
const useDocuments = (options = {}) => {
  const {
    pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    searchTerm = '',
    sortField = 'updatedAt',
    sortOrder = 'desc',
    trashed = false,
    excludeLocalFiles = false
  } = options;

  // 获取文档列表
  const {
    data: documentsData,
    loading: documentsLoading,
    error: documentsError,
    refresh: refreshDocuments
  } = useRequest(
    () => documentApiUtils.fetchDocuments({
      page: 1,
      limit: pageSize,
      search: searchTerm,
      sort: sortField,
      order: sortOrder,
      trashed,
      excludeLocalFiles
    }),
    {
      refreshDeps: [searchTerm, sortField, sortOrder, trashed, excludeLocalFiles],
      cacheKey: `documents-${searchTerm}-${sortField}-${sortOrder}-${trashed}-${excludeLocalFiles}`,
      staleTime: 5 * 60 * 1000, // 5分钟缓存
    }
  );

  // 创建文档
  const {
    run: createDocument,
    loading: createLoading
  } = useRequest(
    documentApiUtils.createDocument,
    {
      manual: true,
      onSuccess: () => {
        refreshDocuments();
      }
    }
  );

  // 更新文档
  const {
    run: updateDocument,
    loading: updateLoading
  } = useRequest(
    documentApiUtils.updateDocument,
    {
      manual: true,
      onSuccess: () => {
        refreshDocuments();
      }
    }
  );

  // 删除文档
  const {
    run: deleteDocument,
    loading: deleteLoading
  } = useRequest(
    documentApiUtils.deleteDocument,
    {
      manual: true,
      onSuccess: () => {
        refreshDocuments();
      }
    }
  );

  // 搜索文档
  const {
    run: searchDocuments,
    loading: searchLoading
  } = useRequest(
    documentApiUtils.searchDocuments,
    {
      manual: true,
      debounceWait: 300
    }
  );

  // 处理创建文档
  const handleCreateDocument = useCallback(async (documentData) => {
    try {
      const result = await createDocument(documentData);
      return result;
    } catch (error) {
      console.error('创建文档失败:', error);
      throw error;
    }
  }, [createDocument]);

  // 处理更新文档
  const handleUpdateDocument = useCallback(async (id, documentData) => {
    try {
      const result = await updateDocument({ id, ...documentData });
      return result;
    } catch (error) {
      console.error('更新文档失败:', error);
      throw error;
    }
  }, [updateDocument]);

  // 处理删除文档
  const handleDeleteDocument = useCallback(async (id) => {
    try {
      await deleteDocument(id);
    } catch (error) {
      console.error('删除文档失败:', error);
      throw error;
    }
  }, [deleteDocument]);

  // 处理搜索
  const handleSearch = useCallback(async (term) => {
    try {
      const result = await searchDocuments(term);
      return result;
    } catch (error) {
      console.error('搜索文档失败:', error);
      throw error;
    }
  }, [searchDocuments]);

  // 计算统计数据
  const statistics = useMemo(() => {
    if (!documentsData?.data) return null;
    
    const documents = Array.isArray(documentsData.data) ? documentsData.data : [];
    const total = documentsData.total || 0;
    const recentCount = documents.filter(doc => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(doc.updatedAt) > oneWeekAgo;
    }).length;

    return {
      total,
      recent: recentCount,
      loading: documentsLoading
    };
  }, [documentsData, documentsLoading]);

  return {
    // 数据
    documents: Array.isArray(documentsData?.data) ? documentsData.data : [],
    total: documentsData?.total || 0,
    statistics,
    
    // 加载状态
    loading: documentsLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    searchLoading,
    
    // 错误状态
    error: documentsError,
    
    // 操作方法
    refreshDocuments,
    handleCreateDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    handleSearch,
    
    // 原始方法
    createDocument,
    updateDocument,
    deleteDocument,
    searchDocuments
  };
};

export default useDocuments;
