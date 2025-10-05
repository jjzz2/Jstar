import { apiClient } from '../api';

export const formsService = {
  // GET /forms
  fetchFormList: async (trashed = false, search = '', page = 1, limit = 20, sort = 'lastUpdated') => {
    const params = new URLSearchParams();
    if (trashed) params.set('trashed', 'true');
    if (search) params.set('search', search);
    if (page) params.set('page', page.toString());
    if (limit) params.set('limit', limit.toString());
    if (sort) params.set('sort', sort);
    const qs = params.toString();
    const url = qs ? `/forms?${qs}` : '/forms';
    const { data } = await apiClient.get(url);
    return data; // {data: [...], pagination: {...}}
  },

  // GET /forms/:id
  fetchForm: async (id) => {
    try {
      console.log('fetchForm called with ID:', id, 'Type:', typeof id, 'Length:', id?.length);
      const url = `/forms/${encodeURIComponent(id)}`;
      console.log('Request URL:', url);
      const { data } = await apiClient.get(url);
      console.log('API response:', data);
      return data; // {id, title, content, lastUpdated, type}
    } catch (error) {
      console.error('Failed to fetch form:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
      // 如果表单不存在，返回默认数据
      if (error.response?.status === 400 || error.response?.status === 404) {
        console.log('Returning default form data for ID:', id);
        return {
          id,
          title: '未命名表单',
          content: JSON.stringify({
            title: '未命名表单',
            description: '',
            questions: []
          }),
          lastUpdated: new Date().toISOString(),
          type: 'FORM'
        };
      }
      throw error;
    }
  },

  // GET /forms/:id/structure
  fetchFormStructure: async (id) => {
    try {
      const { data } = await apiClient.get(`/forms/${id}/structure`);
      return data; // {title, description, questions}
    } catch (error) {
      console.error('Failed to fetch form structure:', error);
      // 如果结构不存在，返回默认数据
      if (error.response?.status === 400 || error.response?.status === 404) {
        return {
          title: '未命名表单',
          description: '',
          questions: []
        };
      }
      throw error;
    }
  },

  // POST /forms
  createForm: async (formData) => {
    console.log('formsService.createForm called with:', formData);
    try {
      const { data } = await apiClient.post('/forms', formData);
      console.log('formsService.createForm API response:', data);
      return data; // {id, title, content, lastUpdated, type}
    } catch (error) {
      console.error('formsService.createForm error:', error);
      throw error;
    }
  },

  // PATCH /forms/:id
  updateForm: async (id, content) => {
    const { data } = await apiClient.patch(`/forms/${id}`, { content });
    return data; // updated form
  },

  // PUT /forms/:id/structure
  updateFormStructure: async (id, formData) => {
    const { data } = await apiClient.put(`/forms/${id}/structure`, { formData });
    return data; // updated form
  },

  // PATCH /forms/:id - update trashed state
  updateFormTrashed: async (id, isTrashed) => {
    const { data } = await apiClient.patch(`/forms/${id}`, { isTrashed });
    return data;
  },

  // DELETE /forms/:id
  deleteForm: async (id) => {
    await apiClient.delete(`/forms/${id}`);
    return { success: true };
  },

  // POST /forms/batch
  batchOperation: async (action, ids) => {
    const { data } = await apiClient.post('/forms/batch', { action, ids });
    return data; // {results: [...]}
  },

  // GET /forms/stats
  fetchFormStats: async () => {
    const { data } = await apiClient.get('/forms/stats');
    return data; // {total, active, trashed, recent}
  },

  // POST /forms/:id/copy
  copyForm: async (id, title) => {
    const { data } = await apiClient.post(`/forms/${id}/copy`, { title });
    return data; // new form object
  },
};
