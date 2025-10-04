import React, { Suspense, lazy } from 'react';
import { Spin } from 'antd';

// 懒加载组件包装器
const withLazyLoading = (Component, fallback = null) => {
  const LazyComponent = lazy(Component);
  
  return (props) => (
    <Suspense fallback={fallback || <Spin size="large" />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// 懒加载页面组件
export const LazyDashboardPage = withLazyLoading(
  () => import('../../pages/DashboardPage')
);

export const LazyFormsPage = withLazyLoading(
  () => import('../../pages/FormsPage')
);

export const LazyTrashPage = withLazyLoading(
  () => import('../../pages/TrashPage')
);

export const LazyEditorPage = withLazyLoading(
  () => import('../../pages/EditorPage')
);

export const LazyFormBuilderPage = withLazyLoading(
  () => import('../../pages/FormBuilderPage')
);

export const LazyUserSettingsPage = withLazyLoading(
  () => import('../../pages/UserSettingsPage')
);

export const LazyAuthPage = withLazyLoading(
  () => import('../../pages/AuthPage')
);

// 懒加载公共组件
export const LazyAiAssistant = withLazyLoading(
  () => import('../AiAssistant')
);

export const LazyUmoEditor = withLazyLoading(
  () => import('../UmoEditor')
);

// 懒加载工具组件
export const LazyCharts = withLazyLoading(
  () => import('../Charts')
);

export const LazyRichEditor = withLazyLoading(
  () => import('../RichEditor')
);

export const LazyFileUpload = withLazyLoading(
  () => import('../FileUpload')
);
