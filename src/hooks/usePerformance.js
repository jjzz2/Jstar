import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * 性能优化相关hooks
 */

/**
 * 防抖hook
 * @param {Function} callback - 回调函数
 * @param {number} delay - 延迟时间
 * @param {Array} deps - 依赖数组
 * @returns {Function} 防抖后的函数
 */
export const useDebounceCallback = (callback, delay = 300, deps = []) => {
  const timeoutRef = useRef();
  
  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay, ...deps]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * 节流hook
 * @param {Function} callback - 回调函数
 * @param {number} delay - 延迟时间
 * @param {Array} deps - 依赖数组
 * @returns {Function} 节流后的函数
 */
export const useThrottleCallback = (callback, delay = 300, deps = []) => {
  const lastRun = useRef(Date.now());
  
  const throttledCallback = useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay, ...deps]);

  return throttledCallback;
};

/**
 * 虚拟滚动hook
 * @param {Array} items - 数据数组
 * @param {number} itemHeight - 每项高度
 * @param {number} containerHeight - 容器高度
 * @returns {Object} 虚拟滚动配置
 */
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  
  const visibleItems = items.slice(startIndex, endIndex);
  
  const offsetY = startIndex * itemHeight;
  
  return {
    visibleItems,
    offsetY,
    totalHeight,
    onScroll: (e) => setScrollTop(e.target.scrollTop)
  };
};

/**
 * 内存优化hook - 清理副作用
 * @param {Function} effect - 副作用函数
 * @param {Array} deps - 依赖数组
 */
export const useCleanupEffect = (effect, deps = []) => {
  const cleanupRef = useRef();
  
  useEffect(() => {
    cleanupRef.current = effect();
    
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, deps);
};

/**
 * 缓存计算结果hook
 * @param {Function} computeFn - 计算函数
 * @param {Array} deps - 依赖数组
 * @returns {*} 计算结果
 */
export const useMemoizedValue = (computeFn, deps) => {
  return useMemo(computeFn, deps);
};

/**
 * 稳定的引用hook
 * @param {*} value - 值
 * @returns {*} 稳定的引用
 */
export const useStableRef = (value) => {
  const ref = useRef(value);
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref;
};

/**
 * 批量更新hook
 * @param {Function} updateFn - 更新函数
 * @param {number} delay - 延迟时间
 * @returns {Function} 批量更新函数
 */
export const useBatchedUpdates = (updateFn, delay = 0) => {
  const timeoutRef = useRef();
  const pendingUpdates = useRef([]);
  
  const batchedUpdate = useCallback((...args) => {
    pendingUpdates.current.push(args);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      updateFn(pendingUpdates.current);
      pendingUpdates.current = [];
    }, delay);
  }, [updateFn, delay]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return batchedUpdate;
};

/**
 * 性能监控hook
 * @param {string} name - 监控名称
 * @returns {Object} 性能监控工具
 */
export const usePerformanceMonitor = (name) => {
  const startTime = useRef();
  const endTime = useRef();
  
  const start = useCallback(() => {
    startTime.current = performance.now();
  }, []);
  
  const end = useCallback(() => {
    endTime.current = performance.now();
    const duration = endTime.current - startTime.current;
    console.log(`${name} 执行时间: ${duration.toFixed(2)}ms`);
    return duration;
  }, [name]);
  
  const measure = useCallback((fn) => {
    start();
    const result = fn();
    end();
    return result;
  }, [start, end]);
  
  return { start, end, measure };
};
