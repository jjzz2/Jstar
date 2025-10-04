import { useState, useEffect, useCallback } from 'react';
import { LocalStorageUtils } from '../utils/storage';

/**
 * 本地存储管理自定义hook
 */
const useLocalStorage = (key, defaultValue = null) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return LocalStorageUtils.get(key, defaultValue);
    } catch (error) {
      console.error(`读取localStorage失败: ${key}`, error);
      return defaultValue;
    }
  });

  // 设置值
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      LocalStorageUtils.set(key, valueToStore);
    } catch (error) {
      console.error(`设置localStorage失败: ${key}`, error);
    }
  }, [key, storedValue]);

  // 删除值
  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      LocalStorageUtils.remove(key);
    } catch (error) {
      console.error(`删除localStorage失败: ${key}`, error);
    }
  }, [key, defaultValue]);

  // 监听localStorage变化
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`解析localStorage失败: ${key}`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
