import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// 页面组件导入
import WelcomePage from '../pages/WelcomePage';
import DashboardPage from '../pages/DashboardPage';
import EditorPage from '../pages/EditorPage';
import TrashPage from '../pages/TrashPage';
import FormsPage from '../pages/FormsPage';
import FormBuilderPage from '../pages/FormBuilderPage';
import UserSettingsPage from '../pages/UserSettingsPage';
import AuthPage from '../pages/AuthPage';
import LocalFilesPage from '../pages/LocalFilesPage';

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: '/login',
    element: <AuthPage />,
  },
  {
    path: '/register',
    element: <AuthPage />,
  },
  {
    path: '/dashboard',
    element: (
      <Layout>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/docs',
    element: (
      <Layout>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/local-files',
    element: (
      <Layout>
        <ProtectedRoute>
          <LocalFilesPage />
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
    path: '/forms',
    element: (
      <Layout>
        <ProtectedRoute>
          <FormsPage />
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
          <UserSettingsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/settings',
    element: (
      <Layout>
        <ProtectedRoute>
          <UserSettingsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
]);
