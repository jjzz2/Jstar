import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 搜索状态
  search: {
    term: '',
    history: [],
    isSearching: false
  },
  
  // UI状态
  ui: {
    sidebarCollapsed: false,
    theme: 'light',
    language: 'zh-CN'
  },
  
  // 用户偏好设置
  preferences: {
    notifications: true,
    emailNotifications: false,
    autoSave: true,
    aiAssistant: true
  },
  
  // 加载状态
  loading: {
    global: false,
    search: false,
    forms: false,
    documents: false
  }
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    // 搜索相关
    setSearchTerm: (state, action) => {
      state.search.term = action.payload;
    },
    
    setSearchHistory: (state, action) => {
      state.search.history = action.payload;
    },
    
    addSearchHistory: (state, action) => {
      const term = action.payload;
      if (term && !state.search.history.includes(term)) {
        state.search.history.unshift(term);
        // 保持最多10个历史记录
        if (state.search.history.length > 10) {
          state.search.history = state.search.history.slice(0, 10);
        }
      }
    },
    
    clearSearchHistory: (state) => {
      state.search.history = [];
    },
    
    setSearching: (state, action) => {
      state.search.isSearching = action.payload;
    },
    
    // UI状态
    toggleSidebar: (state) => {
      state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action) => {
      state.ui.sidebarCollapsed = action.payload;
    },
    
    setTheme: (state, action) => {
      state.ui.theme = action.payload;
    },
    
    setLanguage: (state, action) => {
      state.ui.language = action.payload;
    },
    
    // 用户偏好设置
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    setNotifications: (state, action) => {
      state.preferences.notifications = action.payload;
    },
    
    setEmailNotifications: (state, action) => {
      state.preferences.emailNotifications = action.payload;
    },
    
    setAutoSave: (state, action) => {
      state.preferences.autoSave = action.payload;
    },
    
    setAiAssistant: (state, action) => {
      state.preferences.aiAssistant = action.payload;
    },
    
    // 加载状态
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    setSearchLoading: (state, action) => {
      state.loading.search = action.payload;
    },
    
    setFormsLoading: (state, action) => {
      state.loading.forms = action.payload;
    },
    
    setDocumentsLoading: (state, action) => {
      state.loading.documents = action.payload;
    },
    
    // 重置状态
    resetCommon: () => initialState
  }
});

export const {
  setSearchTerm,
  setSearchHistory,
  addSearchHistory,
  clearSearchHistory,
  setSearching,
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  setLanguage,
  updatePreferences,
  setNotifications,
  setEmailNotifications,
  setAutoSave,
  setAiAssistant,
  setGlobalLoading,
  setSearchLoading,
  setFormsLoading,
  setDocumentsLoading,
  resetCommon
} = commonSlice.actions;

export default commonSlice.reducer;
