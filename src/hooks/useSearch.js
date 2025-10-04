import { useRequest } from 'ahooks';
import { useCallback, useMemo, useState } from 'react';
import { SearchHistoryUtils } from '../utils/storage';
import { DEBOUNCE_DELAY } from '../utils/constants';

/**
 * 搜索管理自定义hook
 */
const useSearch = (options = {}) => {
  const {
    searchFunction,
    debounceWait = DEBOUNCE_DELAY.SEARCH,
    cacheKey = 'search',
    enableHistory = true
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState(
    enableHistory ? SearchHistoryUtils.getAll() : []
  );

  // 搜索请求
  const {
    data: searchResults,
    loading: searchLoading,
    error: searchError,
    run: runSearch,
    refresh: refreshSearch
  } = useRequest(
    searchFunction,
    {
      manual: true,
      debounceWait,
      cacheKey: `${cacheKey}-${searchTerm}`,
      onSuccess: (result) => {
        if (enableHistory && searchTerm.trim()) {
          SearchHistoryUtils.add(searchTerm);
          setSearchHistory(SearchHistoryUtils.getAll());
        }
      }
    }
  );

  // 处理搜索
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    if (term.trim()) {
      runSearch(term);
    }
  }, [runSearch]);

  // 处理搜索历史点击
  const handleHistoryClick = useCallback((term) => {
    setSearchTerm(term);
    runSearch(term);
  }, [runSearch]);

  // 清空搜索历史
  const clearHistory = useCallback(() => {
    if (enableHistory) {
      SearchHistoryUtils.clear();
      setSearchHistory([]);
    }
  }, [enableHistory]);

  // 删除搜索历史项
  const removeHistoryItem = useCallback((term) => {
    if (enableHistory) {
      SearchHistoryUtils.remove(term);
      setSearchHistory(SearchHistoryUtils.getAll());
    }
  }, [enableHistory]);

  // 搜索统计
  const searchStats = useMemo(() => {
    if (!searchResults) return null;
    
    return {
      total: searchResults.total || 0,
      hasResults: (searchResults.data || []).length > 0,
      searchTerm,
      loading: searchLoading
    };
  }, [searchResults, searchTerm, searchLoading]);

  return {
    // 搜索状态
    searchTerm,
    searchResults: searchResults?.data || [],
    total: searchResults?.total || 0,
    searchHistory,
    searchStats,
    
    // 加载状态
    searchLoading,
    
    // 错误状态
    searchError,
    
    // 操作方法
    handleSearch,
    handleHistoryClick,
    clearHistory,
    removeHistoryItem,
    refreshSearch,
    
    // 原始方法
    runSearch
  };
};

export default useSearch;
