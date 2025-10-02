import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { docsService } from '../services/docsService';

export const fetchDocs = createAsyncThunk('docs/fetchDocs', async ({ trashed = false, search = '' } = {}) => {
  const list = await docsService.fetchDocumentList(trashed, search);
  return { trashed, list };
});

export const createDoc = createAsyncThunk('docs/createDoc', async ({ title }) => {
  const doc = await docsService.createDocument(title);
  return doc;
});

export const updateDocContent = createAsyncThunk('docs/updateDocContent', async ({ id, content }) => {
  const doc = await docsService.updateDocument(id, content);
  return doc;
});

export const fetchDocById = createAsyncThunk('docs/fetchDocById', async ({ id }) => {
  const doc = await docsService.fetchDocument(id);
  return doc;
});

export const updateDocTrashed = createAsyncThunk('docs/updateDocTrashed', async ({ id, isTrashed }) => {
  const doc = await docsService.updateDocumentTrashed(id, isTrashed);
  return doc;
});

export const deleteDocForever = createAsyncThunk('docs/deleteDocForever', async ({ id }) => {
  await docsService.deleteDocument(id);
  return { id };
});

const docsSlice = createSlice({
  name: 'docs',
  initialState: {
    list: [],
    trashedList: [],
    currentDoc: null,
    currentStatus: 'idle',
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDocs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { trashed, list } = action.payload;
        if (trashed) state.trashedList = list; else state.list = list;
      })
      .addCase(fetchDocs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createDoc.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateDocContent.fulfilled, (state, action) => {
        const idx = state.list.findIndex(d => d.id === action.payload.id);
        if (idx >= 0) state.list[idx] = action.payload;
        if (state.currentDoc && state.currentDoc.id === action.payload.id) {
          state.currentDoc = action.payload;
        }
      })
      .addCase(updateDocTrashed.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.filter(d => d.id !== updated.id);
        if (updated.isTrashed) state.trashedList.unshift(updated);
      })
      .addCase(deleteDocForever.fulfilled, (state, action) => {
        state.trashedList = state.trashedList.filter(d => d.id !== action.payload.id);
      })
      .addCase(fetchDocById.pending, (state) => {
        state.currentStatus = 'loading';
      })
      .addCase(fetchDocById.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.currentDoc = action.payload;
      })
      .addCase(fetchDocById.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export default docsSlice.reducer;


