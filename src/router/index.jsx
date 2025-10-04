import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { ROUTES } from './routes';

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
    path: ROUTES.HOME,
    element: <WelcomePage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <AuthPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <AuthPage />,
  },
  {
    path: ROUTES.DOCS,
    element: (
      <Layout>
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: ROUTES.LOCAL_FILES,
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
    path: ROUTES.FORMS,
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
    path: ROUTES.TRASH,
    element: (
      <Layout>
        <ProtectedRoute>
          <TrashPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: ROUTES.PROFILE,
    element: (
      <Layout>
        <ProtectedRoute>
          <UserSettingsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: ROUTES.SETTINGS,
    element: (
      <Layout>
        <ProtectedRoute>
          <UserSettingsPage />
        </ProtectedRoute>
      </Layout>
    ),
  },
]);
