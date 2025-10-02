import { apiClient } from '../api';

export const formsService = {
  // GET /forms
  fetchFormList: async (trashed = false, search = '') => {
    const params = new URLSearchParams();
    if (trashed) params.set('trashed', 'true');
    if (search) params.set('search', search);
    const qs = params.toString();
    const url = qs ? `/forms?${qs}` : '/forms';
    const { data } = await apiClient.get(url);
    return data; // [{id, title, lastUpdated, type}, ...]
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
};
