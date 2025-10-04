import { apiClient } from '../api';

export const docsService = {
  // GET /docs
  fetchDocumentList: async (trashed = false, search = '') => {
    const params = new URLSearchParams();
    if (trashed) params.set('trashed', 'true');
    if (search) params.set('search', search);
    const qs = params.toString();
    const url = qs ? `/docs?${qs}` : '/docs';
    const { data } = await apiClient.get(url);
    return data; // [{id, title, lastUpdated}, ...]
  },

  // GET /docs/:id
  fetchDocument: async (id) => {
    const { data } = await apiClient.get(`/docs/${id}`);
    return data; // {id, title, content, lastUpdated}
  },

  // POST /docs
  createDocument: async (title) => {
    const { data } = await apiClient.post('/docs', { title });
    return data; // {id, title, content, lastUpdated}
  },

  // PATCH /docs/:id
  updateDocument: async (id, content) => {
    const { data } = await apiClient.patch(`/docs/${id}`, { content });
    return data; // updated document
  },

  // PATCH /docs/:id - update trashed state
  updateDocumentTrashed: async (id, isTrashed) => {
    const { data } = await apiClient.patch(`/docs/${id}`, { isTrashed });
    return data;
  },

  // DELETE /docs/:id
  deleteDocument: async (id) => {
    await apiClient.delete(`/docs/${id}`);
    return { success: true };
  },
};
