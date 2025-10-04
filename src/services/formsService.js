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
    const { data } = await apiClient.get(`/forms/${id}`);
    return data; // {id, title, content, lastUpdated, type}
  },

  // GET /forms/:id/structure
  fetchFormStructure: async (id) => {
    const { data } = await apiClient.get(`/forms/${id}/structure`);
    return data; // {title, description, questions}
  },

  // POST /forms
  createForm: async (title, description = '') => {
    const { data } = await apiClient.post('/forms', { title, description });
    return data; // {id, title, content, lastUpdated, type}
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
