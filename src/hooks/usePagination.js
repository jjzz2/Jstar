import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '../utils/constants';

/**
 * 分页管理自定义hook
 */
const usePagination = (options = {}) => {
  const {
    defaultPage = 1,
    defaultPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    total = 0,
    showSizeChanger = true,
    showQuickJumper = true,
    pageSizeOptions = PAGINATION.PAGE_SIZE_OPTIONS
  } = options;

  const [current, setCurrent] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // 计算总页数
  const totalPages = useMemo(() => {
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  // 计算偏移量
  const offset = useMemo(() => {
    return (current - 1) * pageSize;
  }, [current, pageSize]);

  // 处理页码变化
  const handlePageChange = useCallback((page, size) => {
    setCurrent(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  }, [pageSize]);

  // 处理页面大小变化
  const handlePageSizeChange = useCallback((current, size) => {
    setCurrent(1); // 重置到第一页
    setPageSize(size);
  }, []);

  // 跳转到指定页
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrent(page);
    }
  }, [totalPages]);

  // 跳转到第一页
  const goToFirst = useCallback(() => {
    setCurrent(1);
  }, []);

  // 跳转到最后一页
  const goToLast = useCallback(() => {
    setCurrent(totalPages);
  }, [totalPages]);

  // 跳转到上一页
  const goToPrev = useCallback(() => {
    if (current > 1) {
      setCurrent(current - 1);
    }
  }, [current]);

  // 跳转到下一页
  const goToNext = useCallback(() => {
    if (current < totalPages) {
      setCurrent(current + 1);
    }
  }, [current, totalPages]);

  // 重置分页
  const resetPagination = useCallback(() => {
    setCurrent(defaultPage);
    setPageSize(defaultPageSize);
  }, [defaultPage, defaultPageSize]);

  // 分页配置
  const paginationConfig = useMemo(() => ({
    current,
    pageSize,
    total,
    showSizeChanger,
    showQuickJumper,
    pageSizeOptions,
    onChange: handlePageChange,
    onShowSizeChange: handlePageSizeChange,
    showTotal: (total, range) => 
      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
  }), [
    current,
    pageSize,
    total,
    showSizeChanger,
    showQuickJumper,
    pageSizeOptions,
    handlePageChange,
    handlePageSizeChange
  ]);

  // 分页信息
  const paginationInfo = useMemo(() => ({
    current,
    pageSize,
    total,
    totalPages,
    offset,
    hasNext: current < totalPages,
    hasPrev: current > 1,
    startIndex: offset + 1,
    endIndex: Math.min(offset + pageSize, total)
  }), [current, pageSize, total, totalPages, offset]);

  return {
    // 分页状态
    current,
    pageSize,
    total,
    totalPages,
    offset,
    
    // 分页信息
    paginationInfo,
    
    // 分页配置
    paginationConfig,
    
    // 操作方法
    handlePageChange,
    handlePageSizeChange,
    goToPage,
    goToFirst,
    goToLast,
    goToPrev,
    goToNext,
    resetPagination,
    
    // 设置方法
    setCurrent,
    setPageSize
  };
};

export default usePagination;
