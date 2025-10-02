# 项目结构说明

## 📁 目录结构

```
src/
├── components/           # 通用组件
│   ├── Header.jsx
│   ├── Layout.jsx
│   ├── ProtectedRoute.jsx
│   ├── GlobalSpinner.jsx
│   └── AiAssistant.jsx
├── pages/               # 页面组件（每个页面一个文件夹）
│   ├── DashboardPage/
│   │   ├── index.jsx
│   │   └── styles.module.css
│   ├── EditorPage/
│   │   ├── index.jsx
│   │   └── styles.module.css
│   ├── FormBuilderPage/
│   │   ├── index.jsx
│   │   ├── LeftPanel.jsx
│   │   ├── EditCanvas.jsx
│   │   ├── RightPanel.jsx
│   │   ├── ComponentLib.jsx
│   │   ├── Layers.jsx
│   │   ├── QuestionComponent.jsx
│   │   ├── PropComponent.jsx
│   │   ├── PageSettings.jsx
│   │   └── styles.module.css
│   ├── TrashPage/
│   │   ├── index.jsx
│   │   └── styles.module.css
│   ├── LoginPage/
│   │   ├── index.jsx
│   │   └── styles.module.css
│   ├── RegisterPage/
│   │   ├── index.jsx
│   │   └── styles.module.css
│   ├── ProfilePage/
│   │   ├── index.jsx
│   │   └── styles.module.css
│   └── SettingsPage/
│       ├── index.jsx
│       └── styles.module.css
├── router/              # 路由配置
│   ├── index.js        # 主路由配置
│   └── routes.js       # 路由常量定义
├── services/           # API服务层
│   ├── docsService.js
│   └── formsService.js
├── store/              # Redux状态管理
│   ├── store.js
│   ├── authSlice.js
│   ├── docsSlice.js
│   └── formBuilderSlice.js
├── App.js              # 应用入口
└── api.js              # API客户端配置
```

## 🎯 设计原则

### 1. 页面组件组织
- **一个页面一个文件夹**: 每个页面都有独立的文件夹，包含主组件和样式文件
- **统一命名**: 所有页面文件夹都以`Page`结尾
- **模块化样式**: 每个页面都有自己的`styles.module.css`文件

### 2. 路由管理
- **集中式路由配置**: 所有路由定义在`src/router/index.js`中
- **路由常量**: 在`src/router/routes.js`中定义路由常量，便于维护
- **类型安全**: 使用React Router v6的最新API

### 3. 组件分层
- **页面组件**: 位于`src/pages/`，负责页面级别的逻辑
- **通用组件**: 位于`src/components/`，可复用的UI组件
- **服务层**: 位于`src/services/`，API调用逻辑

## 📋 页面组件说明

### DashboardPage
- **功能**: 文档和表单列表展示
- **特性**: 支持搜索、筛选、分页
- **样式**: 卡片布局，响应式设计

### EditorPage
- **功能**: 富文本文档编辑
- **特性**: 实时保存，AI助手集成
- **样式**: 全屏编辑界面

### FormBuilderPage
- **功能**: 低代码表单构建器
- **特性**: 拖拽组件，实时预览，属性编辑
- **组件**: 三面板布局（组件库、画布、属性面板）

### TrashPage
- **功能**: 回收站管理
- **特性**: 恢复、永久删除
- **样式**: 列表展示，批量操作

### LoginPage & RegisterPage
- **功能**: 用户认证
- **特性**: 表单验证，错误处理
- **样式**: 居中卡片布局

### ProfilePage
- **功能**: 个人资料管理
- **特性**: 信息编辑，头像显示
- **样式**: 表单布局，用户友好

### SettingsPage
- **功能**: 系统设置
- **特性**: 分类设置，实时保存
- **样式**: 卡片分组，开关控件

## 🔧 技术特性

### 路由管理
- 使用React Router v6的`createBrowserRouter`
- 支持路由守卫（ProtectedRoute）
- 动态路由参数

### 状态管理
- Redux Toolkit进行状态管理
- 异步操作使用createAsyncThunk
- 模块化slice设计

### 样式管理
- CSS Modules避免样式冲突
- 每个页面独立的样式文件
- 响应式设计

### API管理
- 统一的API客户端配置
- 服务层封装API调用
- 错误处理和拦截器

## 🚀 优势

1. **可维护性**: 清晰的文件结构，易于定位和修改
2. **可扩展性**: 模块化设计，易于添加新功能
3. **可复用性**: 通用组件可在多个页面使用
4. **类型安全**: 路由常量和API类型定义
5. **开发效率**: 标准化的组件结构，提高开发速度
