import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import docsReducer from './docsSlice';
import formBuilderReducer from './formBuilderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    docs: docsReducer,
    formBuilder: formBuilderReducer,
  },
});


