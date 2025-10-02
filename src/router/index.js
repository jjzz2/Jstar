import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import GlobalSpinner from '../components/GlobalSpinner';

// 页面组件导入
import DashboardPage from '../pages/DashboardPage';
import EditorPage from '../pages/EditorPage';
import TrashPage from '../pages/TrashPage';
import FormBuilderPage from '../pages/FormBuilderPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <Layout>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/docs/:documentId',
    element: (
      <Layout>
        <ProtectedRoute>
          <EditorPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/forms/:formId',
    element: (
      <Layout>
        <ProtectedRoute>
          <FormBuilderPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/trash',
    element: (
      <Layout>
        <ProtectedRoute>
          <TrashPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/profile',
    element: (
      <Layout>
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/settings',
    element: (
      <Layout>
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
]);
