/**
 * 验证工具函数
 */

/**
 * 验证邮箱
 * @param {string} email - 邮箱
 * @returns {boolean} 是否有效
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {Object} 验证结果
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    score: 0,
    suggestions: []
  };

  if (!password) {
    result.suggestions.push('密码不能为空');
    return result;
  }

  if (password.length < 6) {
    result.suggestions.push('密码至少6个字符');
  } else {
    result.score += 1;
  }

  if (password.length >= 8) {
    result.score += 1;
  }

  if (/[a-z]/.test(password)) {
    result.score += 1;
  } else {
    result.suggestions.push('建议包含小写字母');
  }

  if (/[A-Z]/.test(password)) {
    result.score += 1;
  } else {
    result.suggestions.push('建议包含大写字母');
  }

  if (/\d/.test(password)) {
    result.score += 1;
  } else {
    result.suggestions.push('建议包含数字');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.score += 1;
  } else {
    result.suggestions.push('建议包含特殊字符');
  }

  result.isValid = result.score >= 3;

  return result;
};

/**
 * 验证用户名
 * @param {string} username - 用户名
 * @returns {Object} 验证结果
 */
export const validateUsername = (username) => {
  const result = {
    isValid: false,
    message: ''
  };

  if (!username) {
    result.message = '用户名不能为空';
    return result;
  }

  if (username.length < 3) {
    result.message = '用户名至少3个字符';
    return result;
  }

  if (username.length > 20) {
    result.message = '用户名不能超过20个字符';
    return result;
  }

  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
    result.message = '用户名只能包含字母、数字、下划线和中文';
    return result;
  }

  result.isValid = true;
  return result;
};

/**
 * 验证URL
 * @param {string} url - URL
 * @returns {boolean} 是否有效
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证身份证号
 * @param {string} idCard - 身份证号
 * @returns {boolean} 是否有效
 */
export const isValidIdCard = (idCard) => {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return idCardRegex.test(idCard);
};

/**
 * 表单验证规则生成器
 */
export class FormValidationRules {
  /**
   * 必填验证
   * @param {string} message - 错误消息
   * @returns {Object} 验证规则
   */
  static required(message = '此字段为必填项') {
    return {
      required: true,
      message
    };
  }

  /**
   * 邮箱验证
   * @param {string} message - 错误消息
   * @returns {Object} 验证规则
   */
  static email(message = '请输入有效的邮箱地址') {
    return {
      type: 'email',
      message
    };
  }

  /**
   * 长度验证
   * @param {number} min - 最小长度
   * @param {number} max - 最大长度
   * @param {string} message - 错误消息
   * @returns {Object} 验证规则
   */
  static length(min, max, message) {
    return {
      min,
      max,
      message: message || `长度应在${min}-${max}个字符之间`
    };
  }

  /**
   * 自定义验证
   * @param {Function} validator - 验证函数
   * @param {string} message - 错误消息
   * @returns {Object} 验证规则
   */
  static custom(validator, message) {
    return {
      validator: (_, value) => {
        if (validator(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(message));
      }
    };
  }

  /**
   * 确认密码验证
   * @param {string} fieldName - 字段名
   * @param {string} message - 错误消息
   * @returns {Object} 验证规则
   */
  static confirmPassword(fieldName = 'password', message = '两次输入的密码不一致') {
    return {
      validator: (_, value) => {
        const form = _.field?.form;
        if (!value || form?.getFieldValue(fieldName) === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(message));
      }
    };
  }
}

/**
 * 常用验证规则组合
 */
export const commonValidationRules = {
  // 用户名规则
  username: [
    FormValidationRules.required('请输入用户名'),
    FormValidationRules.length(3, 20, '用户名长度应在3-20个字符之间'),
    FormValidationRules.custom(
      (value) => /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value),
      '用户名只能包含字母、数字、下划线和中文'
    )
  ],

  // 邮箱规则
  email: [
    FormValidationRules.required('请输入邮箱'),
    FormValidationRules.email('请输入有效的邮箱地址')
  ],

  // 密码规则
  password: [
    FormValidationRules.required('请输入密码'),
    FormValidationRules.length(6, 50, '密码长度应在6-50个字符之间')
  ],

  // 确认密码规则
  confirmPassword: [
    FormValidationRules.required('请确认密码'),
    FormValidationRules.confirmPassword()
  ],

  // 手机号规则
  phone: [
    FormValidationRules.custom(
      (value) => !value || isValidPhone(value),
      '请输入有效的手机号'
    )
  ]
};
