import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import docsReducer from './docsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    docs: docsReducer,
  },
});


