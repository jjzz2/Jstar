import { useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authApiUtils } from '../utils/api';
import { loginUser, logout, fetchProfile } from '../store/authSlice';

/**
 * 认证管理自定义hook
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn, status } = useSelector(state => state.auth);

  // 登录请求
  const {
    run: login,
    loading: loginLoading,
    error: loginError
  } = useRequest(
    authApiUtils.login,
    {
      manual: true,
      onSuccess: (result) => {
        dispatch(loginUser.fulfilled(result));
      },
      onError: (error) => {
        console.error('登录失败:', error);
      }
    }
  );

  // 获取用户信息
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
    refresh: refreshProfile
  } = useRequest(
    authApiUtils.fetchProfile,
    {
      ready: isLoggedIn,
      cacheKey: 'user-profile',
      staleTime: 10 * 60 * 1000, // 10分钟缓存
      onSuccess: (result) => {
        dispatch(fetchProfile.fulfilled(result));
      }
    }
  );

  // 处理登录
  const handleLogin = useCallback(async (credentials) => {
    try {
      const result = await login(credentials);
      return result;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  }, [login]);

  // 处理登出
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // 检查权限
  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    return user.permissions?.includes(permission) || false;
  }, [user]);

  // 检查角色
  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  // 用户信息
  const userInfo = useMemo(() => {
    return {
      ...user,
      ...profileData?.data,
      isLoggedIn,
      isLoading: profileLoading
    };
  }, [user, profileData, isLoggedIn, profileLoading]);

  return {
    // 用户信息
    user: userInfo,
    isLoggedIn,
    
    // 加载状态
    loginLoading,
    profileLoading,
    
    // 错误状态
    loginError,
    profileError,
    
    // 操作方法
    handleLogin,
    handleLogout,
    refreshProfile,
    hasPermission,
    hasRole,
    
    // 原始方法
    login,
    refreshProfile
  };
};

export default useAuth;
