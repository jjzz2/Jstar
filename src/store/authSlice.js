import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

const AUTH_TOKEN_KEY = 'auth_token';

export const loginUser = createAsyncThunk('auth/loginUser', async ({ username, password }) => {
  const data = await authService.login(username, password);
  return data; // { token, user }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async () => {
  const data = await authService.getProfile();
  return data; // { id, name }
});

const initialState = {
  user: null,
  token: localStorage.getItem(AUTH_TOKEN_KEY) || null,
  isLoggedIn: !!localStorage.getItem(AUTH_TOKEN_KEY),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem(AUTH_TOKEN_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoggedIn = true;
        localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;


