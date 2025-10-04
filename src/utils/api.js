import { apiClient } from '../api';

/**
 * API请求工具类
 */
export class ApiUtils {
  /**
   * 创建带错误处理的请求函数
   * @param {Function} apiFunction - API函数
   * @param {Object} options - 配置选项
   * @returns {Function} 包装后的请求函数
   */
  static createRequest(apiFunction, options = {}) {
    return async (...args) => {
      try {
        const result = await apiFunction(...args);
        return result;
      } catch (error) {
        console.error('API请求失败:', error);
        throw error;
      }
    };
  }

  /**
   * 批量请求处理
   * @param {Array} requests - 请求数组
   * @returns {Promise} 批量请求结果
   */
  static async batchRequest(requests) {
    try {
      const results = await Promise.allSettled(requests);
      return results.map((result, index) => ({
        index,
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason : null
      }));
    } catch (error) {
      console.error('批量请求失败:', error);
      throw error;
    }
  }

  /**
   * 重试请求
   * @param {Function} requestFn - 请求函数
   * @param {number} maxRetries - 最大重试次数
   * @param {number} delay - 重试延迟
   * @returns {Promise} 请求结果
   */
  static async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError;
  }
}

/**
 * 文档相关API工具
 */
export const documentApiUtils = {
  // 获取文档列表
  fetchDocuments: ApiUtils.createRequest(
    (params) => apiClient.get('/documents', { params })
  ),
  
  // 获取单个文档
  fetchDocument: ApiUtils.createRequest(
    (id) => apiClient.get(`/documents/${id}`)
  ),
  
  // 创建文档
  createDocument: ApiUtils.createRequest(
    (data) => apiClient.post('/documents', data)
  ),
  
  // 更新文档
  updateDocument: ApiUtils.createRequest(
    ({ id, ...data }) => apiClient.patch(`/documents/${id}`, data)
  ),
  
  // 删除文档
  deleteDocument: ApiUtils.createRequest(
    (id) => apiClient.delete(`/documents/${id}`)
  ),
  
  // 搜索文档
  searchDocuments: ApiUtils.createRequest(
    (searchTerm) => apiClient.get('/documents', { 
      params: { search: searchTerm } 
    })
  )
};

/**
 * 表单相关API工具
 */
export const formApiUtils = {
  // 获取表单列表
  fetchForms: ApiUtils.createRequest(
    (params) => apiClient.get('/forms', { params })
  ),
  
  // 获取单个表单
  fetchForm: ApiUtils.createRequest(
    (id) => apiClient.get(`/forms/${id}`)
  ),
  
  // 获取表单结构
  fetchFormStructure: ApiUtils.createRequest(
    (id) => apiClient.get(`/forms/${id}/structure`)
  ),
  
  // 创建表单
  createForm: ApiUtils.createRequest(
    (data) => apiClient.post('/forms', data)
  ),
  
  // 更新表单
  updateForm: ApiUtils.createRequest(
    ({ id, ...data }) => apiClient.patch(`/forms/${id}`, data)
  ),
  
  // 更新表单结构
  updateFormStructure: ApiUtils.createRequest(
    ({ id, structure }) => apiClient.put(`/forms/${id}/structure`, structure)
  ),
  
  // 删除表单
  deleteForm: ApiUtils.createRequest(
    (id) => apiClient.delete(`/forms/${id}`)
  ),
  
  // 批量操作
  batchOperation: ApiUtils.createRequest(
    (data) => apiClient.post('/forms/batch', data)
  ),
  
  // 复制表单
  copyForm: ApiUtils.createRequest(
    (id) => apiClient.post(`/forms/${id}/copy`)
  ),
  
  // 获取表单统计
  fetchFormStats: ApiUtils.createRequest(
    () => apiClient.get('/forms/stats')
  )
};

/**
 * 认证相关API工具
 */
export const authApiUtils = {
  // 登录
  login: ApiUtils.createRequest(
    (credentials) => apiClient.post('/auth/login', credentials)
  ),
  
  // 获取用户信息
  fetchProfile: ApiUtils.createRequest(
    () => apiClient.get('/auth/profile')
  )
};

/**
 * AI相关API工具
 */
export const aiApiUtils = {
  // AI聊天
  chat: ApiUtils.createRequest(
    (data) => apiClient.post('/ai/chat', data)
  )
};
