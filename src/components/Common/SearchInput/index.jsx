import React, { useState, useEffect, useMemo } from 'react';
import { Input } from 'antd';
import { useDebounce } from 'ahooks';
import styles from './styles.module.css';

const { Search } = Input;

const SearchInput = ({ 
  placeholder = "搜索...",
  onSearch,
  onSearchChange,
  value: controlledValue,
  className,
  size = "middle",
  showHistory = true,
  historyKey = 'search_history'
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [open, setOpen] = useState(false);
  
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  // Debounce the search value to avoid too frequent API calls
  const debouncedSearchValue = useDebounce(value, { wait: 300 });

  // Get search history from localStorage
  const history = useMemo(() => {
    if (!showHistory) return [];
    try {
      const raw = localStorage.getItem(historyKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [showHistory, historyKey]);

  // Save search term to history
  const saveHistory = (term) => {
    if (!term || !showHistory) return;
    try {
      const raw = localStorage.getItem(historyKey);
      const list = raw ? JSON.parse(raw) : [];
      const newList = [term, ...list.filter((t) => t !== term)].slice(0, 5);
      localStorage.setItem(historyKey, JSON.stringify(newList));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Handle search submission
  const handleSearch = (searchValue) => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      saveHistory(trimmedValue);
      onSearch?.(trimmedValue);
    }
    setOpen(false);
  };

  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onSearchChange?.(newValue);
  };

  // Handle history item click
  const handleHistoryClick = (historyItem) => {
    if (controlledValue === undefined) {
      setInternalValue(historyItem);
    }
    onSearchChange?.(historyItem);
    handleSearch(historyItem);
  };

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearchValue !== value) {
      onSearchChange?.(debouncedSearchValue);
    }
  }, [debouncedSearchValue, value, onSearchChange]);

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <Search
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onSearch={handleSearch}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className={styles.searchInput}
        size={size}
        allowClear
      />
      
      {open && showHistory && history.length > 0 && (
        <div className={styles.searchHistory}>
          {history.map((historyItem, index) => (
            <div 
              key={index} 
              className={styles.historyItem}
              onMouseDown={() => handleHistoryClick(historyItem)}
            >
              {historyItem}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
