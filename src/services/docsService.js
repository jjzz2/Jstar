import { apiClient } from '../api';

export const docsService = {
  // GET /documents
  fetchDocumentList: async (trashed = false, search = '') => {
    const params = new URLSearchParams();
    if (trashed) params.set('trashed', 'true');
    if (search) params.set('search', search);
    const qs = params.toString();
    const url = qs ? `/documents?${qs}` : '/documents';
    const { data } = await apiClient.get(url);
    return data; // [{id, title, lastUpdated}, ...]
  },

  // GET /documents/:id
  fetchDocument: async (id) => {
    const { data } = await apiClient.get(`/documents/${id}`);
    return data; // {id, title, content, lastUpdated}
  },

  // POST /documents
  createDocument: async (title) => {
    const { data } = await apiClient.post('/documents', { title });
    return data; // {id, title, content, lastUpdated}
  },

  // PATCH /documents/:id
  updateDocument: async (id, content) => {
    const { data } = await apiClient.patch(`/documents/${id}`, { content });
    return data; // updated document
  },

  // PATCH /documents/:id - update trashed state
  updateDocumentTrashed: async (id, isTrashed) => {
    const { data } = await apiClient.patch(`/documents/${id}`, { isTrashed });
    return data;
  },

  // DELETE /documents/:id
  deleteDocument: async (id) => {
    await apiClient.delete(`/documents/${id}`);
    return { success: true };
  },
};
