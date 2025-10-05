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
    try {
      console.log('docsService.fetchDocument called with ID:', id);
      const { data } = await apiClient.get(`/docs/${id}`);
      console.log('docsService.fetchDocument response:', data);
      return data; // {id, title, content, lastUpdated}
    } catch (error) {
      console.error('docsService.fetchDocument error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // 如果文档不存在，返回默认文档
      if (error.response?.status === 404) {
        console.log('Document not found, returning default document');
        return {
          id,
          title: '未命名文档',
          content: '',
          lastUpdated: new Date().toISOString(),
          type: 'DOC'
        };
      }
      
      throw error;
    }
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
