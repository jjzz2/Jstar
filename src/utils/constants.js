/**
 * 常量定义
 */

// API相关常量
export const API_CONSTANTS = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000
};

// 存储键名
export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'search_history',
  USER_PREFERENCES: 'user_preferences',
  USER_TOKEN: 'user_token',
  USER_INFO: 'user_info',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// 分页相关常量
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: ['10', '20', '50', '100'],
  MAX_PAGE_SIZE: 100
};

// 文件类型常量
export const FILE_TYPES = {
  DOCUMENT: 'DOC',
  FORM: 'FORM',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO'
};

// 文件大小限制
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  AUDIO: 20 * 1024 * 1024, // 20MB
  DOCUMENT: 10 * 1024 * 1024 // 10MB
};

// 主题常量
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// 语言常量
export const LANGUAGES = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US'
};

// 状态常量
export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// 排序常量
export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
};

// 排序字段
export const SORT_FIELDS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  TITLE: 'title',
  SIZE: 'size'
};

// 通知类型
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// 路由常量
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  DOCUMENTS: '/docs',
  FORMS: '/forms',
  TRASH: '/trash'
};

// 权限常量
export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  ADMIN: 'admin'
};

// 组件尺寸
export const COMPONENT_SIZES = {
  SMALL: 'small',
  MIDDLE: 'middle',
  LARGE: 'large'
};

// 动画持续时间
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500
};

// 防抖延迟
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  SCROLL: 100
};

// 缓存时间
export const CACHE_TIME = {
  SHORT: 5 * 60 * 1000, // 5分钟
  MEDIUM: 30 * 60 * 1000, // 30分钟
  LONG: 24 * 60 * 60 * 1000 // 24小时
};
