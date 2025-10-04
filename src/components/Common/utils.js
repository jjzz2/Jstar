// 公共工具函数
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(dateString).toLocaleDateString('zh-CN', {
    ...defaultOptions,
    ...options
  });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^1[3-9]\d{9}$/;
  return re.test(phone);
};

export const getItemTypeIcon = (type) => {
  const iconMap = {
    document: '📄',
    form: '📝',
    image: '🖼️',
    video: '🎥',
    audio: '🎵',
    archive: '📦',
    code: '💻'
  };
  return iconMap[type] || '📄';
};

export const getItemTypeColor = (type) => {
  const colorMap = {
    document: '#52c41a',
    form: '#1890ff',
    image: '#722ed1',
    video: '#eb2f96',
    audio: '#fa8c16',
    archive: '#faad14',
    code: '#13c2c2'
  };
  return colorMap[type] || '#d9d9d9';
};

export default {
  formatDate,
  formatFileSize,
  truncateText,
  generateId,
  debounce,
  throttle,
  getInitials,
  validateEmail,
  validatePhone,
  getItemTypeIcon,
  getItemTypeColor
};
