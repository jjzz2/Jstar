// 路由常量定义
export const ROUTES = {
  // 认证相关
  LOGIN: '/login',
  REGISTER: '/register',
  
  // 主要功能
  DASHBOARD: '/',
  DOCS: '/docs',
  FORMS: '/forms',
  TRASH: '/trash',
  
  // 用户相关
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// 路由生成器
export const createRoute = {
  // 文档路由
  doc: (id) => `/docs/${id}`,
  
  // 表单路由
  form: (id) => `/forms/${id}`,
  
  // 其他路由直接使用常量
  ...ROUTES,
};

// 路由守卫配置
export const ROUTE_GUARDS = {
  // 需要认证的路由
  PROTECTED: [
    ROUTES.DASHBOARD,
    ROUTES.TRASH,
    ROUTES.PROFILE,
    ROUTES.SETTINGS,
  ],
  
  // 公开路由（不需要认证）
  PUBLIC: [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
  ],
  
  // 动态路由模式
  DYNAMIC: {
    DOCS: '/docs/:documentId',
    FORMS: '/forms/:formId',
  },
};
