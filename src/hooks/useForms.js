import { useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { formApiUtils } from '../utils/api';
import { PAGINATION } from '../utils/constants';

/**
 * 表单管理自定义hook
 */
const useForms = (options = {}) => {
  const {
    pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    searchTerm = '',
    sortField = 'updatedAt',
    sortOrder = 'desc',
    trashed = false
  } = options;

  // 获取表单列表
  const {
    data: formsData,
    loading: formsLoading,
    error: formsError,
    refresh: refreshForms
  } = useRequest(
    () => formApiUtils.fetchForms({
      page: 1,
      limit: pageSize,
      search: searchTerm,
      sort: sortField,
      order: sortOrder,
      trashed
    }),
    {
      refreshDeps: [searchTerm, sortField, sortOrder, trashed],
      cacheKey: `forms-${searchTerm}-${sortField}-${sortOrder}-${trashed}`,
      staleTime: 5 * 60 * 1000, // 5分钟缓存
    }
  );

  // 创建表单
  const {
    run: createForm,
    loading: createLoading
  } = useRequest(
    formApiUtils.createForm,
    {
      manual: true,
      onSuccess: () => {
        refreshForms();
      }
    }
  );

  // 更新表单
  const {
    run: updateForm,
    loading: updateLoading
  } = useRequest(
    formApiUtils.updateForm,
    {
      manual: true,
      onSuccess: () => {
        refreshForms();
      }
    }
  );

  // 更新表单结构
  const {
    run: updateFormStructure,
    loading: structureLoading
  } = useRequest(
    formApiUtils.updateFormStructure,
    {
      manual: true,
      onSuccess: () => {
        refreshForms();
      }
    }
  );

  // 删除表单
  const {
    run: deleteForm,
    loading: deleteLoading
  } = useRequest(
    formApiUtils.deleteForm,
    {
      manual: true,
      onSuccess: () => {
        refreshForms();
      }
    }
  );

  // 批量操作
  const {
    run: batchOperation,
    loading: batchLoading
  } = useRequest(
    formApiUtils.batchOperation,
    {
      manual: true,
      onSuccess: () => {
        refreshForms();
      }
    }
  );

  // 复制表单
  const {
    run: copyForm,
    loading: copyLoading
  } = useRequest(
    formApiUtils.copyForm,
    {
      manual: true,
      onSuccess: () => {
        refreshForms();
      }
    }
  );

  // 获取表单统计
  const {
    data: statsData,
    loading: statsLoading,
    refresh: refreshStats
  } = useRequest(
    formApiUtils.fetchFormStats,
    {
      cacheKey: 'form-stats',
      staleTime: 10 * 60 * 1000, // 10分钟缓存
    }
  );

  // 处理创建表单
  const handleCreateForm = useCallback(async (formData) => {
    try {
      const result = await createForm(formData);
      return result;
    } catch (error) {
      console.error('创建表单失败:', error);
      throw error;
    }
  }, [createForm]);

  // 处理更新表单
  const handleUpdateForm = useCallback(async (id, formData) => {
    try {
      const result = await updateForm({ id, ...formData });
      return result;
    } catch (error) {
      console.error('更新表单失败:', error);
      throw error;
    }
  }, [updateForm]);

  // 处理更新表单结构
  const handleUpdateFormStructure = useCallback(async (id, structure) => {
    try {
      const result = await updateFormStructure({ id, structure });
      return result;
    } catch (error) {
      console.error('更新表单结构失败:', error);
      throw error;
    }
  }, [updateFormStructure]);

  // 处理删除表单
  const handleDeleteForm = useCallback(async (id) => {
    try {
      await deleteForm(id);
    } catch (error) {
      console.error('删除表单失败:', error);
      throw error;
    }
  }, [deleteForm]);

  // 处理批量操作
  const handleBatchOperation = useCallback(async (operation, ids) => {
    try {
      const result = await batchOperation({ operation, ids });
      return result;
    } catch (error) {
      console.error('批量操作失败:', error);
      throw error;
    }
  }, [batchOperation]);

  // 处理复制表单
  const handleCopyForm = useCallback(async (id) => {
    try {
      const result = await copyForm(id);
      return result;
    } catch (error) {
      console.error('复制表单失败:', error);
      throw error;
    }
  }, [copyForm]);

  // 计算统计数据
  const statistics = useMemo(() => {
    if (!formsData?.data) return null;
    
    const forms = formsData.data;
    const total = formsData.total || 0;
    const recentCount = forms.filter(form => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(form.updatedAt) > oneWeekAgo;
    }).length;

    return {
      total,
      recent: recentCount,
      loading: formsLoading,
      stats: statsData?.data || null
    };
  }, [formsData, formsLoading, statsData]);

  return {
    // 数据
    forms: formsData?.data || [],
    total: formsData?.total || 0,
    statistics,
    
    // 加载状态
    loading: formsLoading,
    createLoading,
    updateLoading,
    structureLoading,
    deleteLoading,
    batchLoading,
    copyLoading,
    statsLoading,
    
    // 错误状态
    error: formsError,
    
    // 操作方法
    refreshForms,
    refreshStats,
    handleCreateForm,
    handleUpdateForm,
    handleUpdateFormStructure,
    handleDeleteForm,
    handleBatchOperation,
    handleCopyForm,
    
    // 原始方法
    createForm,
    updateForm,
    updateFormStructure,
    deleteForm,
    batchOperation,
    copyForm
  };
};

export default useForms;
