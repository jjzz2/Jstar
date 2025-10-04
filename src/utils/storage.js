/**
 * 本地存储工具类
 */

/**
 * 安全的JSON解析
 * @param {string} str - JSON字符串
 * @param {*} defaultValue - 默认值
 * @returns {*} 解析结果
 */
const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

/**
 * 安全的JSON序列化
 * @param {*} obj - 对象
 * @returns {string} JSON字符串
 */
const safeJsonStringify = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch {
    return '';
  }
};

/**
 * LocalStorage工具类
 */
export class LocalStorageUtils {
  /**
   * 设置值
   * @param {string} key - 键
   * @param {*} value - 值
   */
  static set(key, value) {
    try {
      localStorage.setItem(key, safeJsonStringify(value));
    } catch (error) {
      console.error('LocalStorage设置失败:', error);
    }
  }

  /**
   * 获取值
   * @param {string} key - 键
   * @param {*} defaultValue - 默认值
   * @returns {*} 值
   */
  static get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? safeJsonParse(value, defaultValue) : defaultValue;
    } catch (error) {
      console.error('LocalStorage获取失败:', error);
      return defaultValue;
    }
  }

  /**
   * 删除值
   * @param {string} key - 键
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage删除失败:', error);
    }
  }

  /**
   * 清空所有
   */
  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('LocalStorage清空失败:', error);
    }
  }

  /**
   * 检查是否存在
   * @param {string} key - 键
   * @returns {boolean} 是否存在
   */
  static has(key) {
    return localStorage.getItem(key) !== null;
  }
}

/**
 * SessionStorage工具类
 */
export class SessionStorageUtils {
  /**
   * 设置值
   * @param {string} key - 键
   * @param {*} value - 值
   */
  static set(key, value) {
    try {
      sessionStorage.setItem(key, safeJsonStringify(value));
    } catch (error) {
      console.error('SessionStorage设置失败:', error);
    }
  }

  /**
   * 获取值
   * @param {string} key - 键
   * @param {*} defaultValue - 默认值
   * @returns {*} 值
   */
  static get(key, defaultValue = null) {
    try {
      const value = sessionStorage.getItem(key);
      return value ? safeJsonParse(value, defaultValue) : defaultValue;
    } catch (error) {
      console.error('SessionStorage获取失败:', error);
      return defaultValue;
    }
  }

  /**
   * 删除值
   * @param {string} key - 键
   */
  static remove(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('SessionStorage删除失败:', error);
    }
  }

  /**
   * 清空所有
   */
  static clear() {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('SessionStorage清空失败:', error);
    }
  }

  /**
   * 检查是否存在
   * @param {string} key - 键
   * @returns {boolean} 是否存在
   */
  static has(key) {
    return sessionStorage.getItem(key) !== null;
  }
}

/**
 * 搜索历史管理
 */
export class SearchHistoryUtils {
  static KEY = 'search_history';
  static MAX_SIZE = 10;

  /**
   * 添加搜索历史
   * @param {string} term - 搜索词
   */
  static add(term) {
    if (!term || !term.trim()) return;
    
    const history = this.getAll();
    const newHistory = [term.trim(), ...history.filter(item => item !== term.trim())]
      .slice(0, this.MAX_SIZE);
    
    LocalStorageUtils.set(this.KEY, newHistory);
  }

  /**
   * 获取所有搜索历史
   * @returns {Array} 搜索历史
   */
  static getAll() {
    return LocalStorageUtils.get(this.KEY, []);
  }

  /**
   * 清空搜索历史
   */
  static clear() {
    LocalStorageUtils.remove(this.KEY);
  }

  /**
   * 删除指定搜索历史
   * @param {string} term - 搜索词
   */
  static remove(term) {
    const history = this.getAll();
    const newHistory = history.filter(item => item !== term);
    LocalStorageUtils.set(this.KEY, newHistory);
  }
}

/**
 * 用户偏好设置管理
 */
export class UserPreferencesUtils {
  static KEY = 'user_preferences';

  /**
   * 获取用户偏好设置
   * @returns {Object} 偏好设置
   */
  static get() {
    return LocalStorageUtils.get(this.KEY, {
      theme: 'light',
      language: 'zh-CN',
      notifications: true,
      emailNotifications: false,
      autoSave: true,
      aiAssistant: true
    });
  }

  /**
   * 设置用户偏好
   * @param {Object} preferences - 偏好设置
   */
  static set(preferences) {
    const current = this.get();
    const updated = { ...current, ...preferences };
    LocalStorageUtils.set(this.KEY, updated);
  }

  /**
   * 更新单个偏好设置
   * @param {string} key - 设置键
   * @param {*} value - 设置值
   */
  static update(key, value) {
    const current = this.get();
    current[key] = value;
    LocalStorageUtils.set(this.KEY, current);
  }
}
