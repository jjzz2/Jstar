/**
 * 性能监控工具
 */

/**
 * 性能监控类
 */
export class PerformanceMonitor {
  constructor() {
    this.marks = new Map();
    this.measures = new Map();
  }

  /**
   * 开始标记
   * @param {string} name - 标记名称
   */
  start(name) {
    this.marks.set(name, performance.now());
  }

  /**
   * 结束标记
   * @param {string} name - 标记名称
   * @returns {number} 执行时间
   */
  end(name) {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`标记 ${name} 不存在`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.measures.set(name, duration);
    this.marks.delete(name);
    
    return duration;
  }

  /**
   * 测量函数执行时间
   * @param {string} name - 测量名称
   * @param {Function} fn - 要测量的函数
   * @returns {*} 函数执行结果
   */
  measure(name, fn) {
    this.start(name);
    const result = fn();
    this.end(name);
    return result;
  }

  /**
   * 获取所有测量结果
   * @returns {Object} 测量结果
   */
  getResults() {
    return Object.fromEntries(this.measures);
  }

  /**
   * 清空所有测量结果
   */
  clear() {
    this.marks.clear();
    this.measures.clear();
  }
}

/**
 * 全局性能监控实例
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * 页面加载性能监控
 */
export const monitorPageLoad = () => {
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      const metrics = {
        // DNS查询时间
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        // TCP连接时间
        tcp: navigation.connectEnd - navigation.connectStart,
        // 请求时间
        request: navigation.responseEnd - navigation.requestStart,
        // 解析DOM时间
        domParse: navigation.domContentLoadedEventEnd - navigation.domLoading,
        // 页面完全加载时间
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
      };

      console.log('页面加载性能指标:', metrics);
      
      // 发送到分析服务
      if (window.gtag) {
        window.gtag('event', 'page_load_performance', {
          custom_parameter_1: metrics.loadComplete,
          custom_parameter_2: metrics.domParse,
        });
      }
    }
  });
};

/**
 * 资源加载性能监控
 */
export const monitorResourceLoad = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource') {
        const resourceMetrics = {
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize,
          type: entry.initiatorType,
        };

        // 记录慢资源
        if (entry.duration > 1000) {
          console.warn('慢资源加载:', resourceMetrics);
        }
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
};

/**
 * 内存使用监控
 */
export const monitorMemoryUsage = () => {
  if (performance.memory) {
    const memoryInfo = {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576),
      total: Math.round(performance.memory.totalJSHeapSize / 1048576),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576),
    };

    console.log('内存使用情况 (MB):', memoryInfo);
    
    // 内存使用率过高警告
    if (memoryInfo.used / memoryInfo.limit > 0.8) {
      console.warn('内存使用率过高:', memoryInfo);
    }
  }
};

/**
 * 长任务监控
 */
export const monitorLongTasks = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 50) {
        console.warn('长任务检测:', {
          duration: entry.duration,
          startTime: entry.startTime,
        });
      }
    });
  });

  observer.observe({ entryTypes: ['longtask'] });
};

/**
 * 初始化性能监控
 */
export const initPerformanceMonitoring = () => {
  monitorPageLoad();
  monitorResourceLoad();
  monitorMemoryUsage();
  monitorLongTasks();
  
  // 定期检查内存使用
  setInterval(monitorMemoryUsage, 30000);
};

/**
 * 组件渲染性能监控
 */
export const monitorComponentRender = (componentName) => {
  return (WrappedComponent) => {
    return (props) => {
      const startTime = performance.now();
      
      const result = WrappedComponent(props);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // 超过一帧的时间
        console.warn(`组件 ${componentName} 渲染时间过长: ${renderTime.toFixed(2)}ms`);
      }
      
      return result;
    };
  };
};
