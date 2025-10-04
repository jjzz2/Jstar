# Koa服务器模块化结构

## 📁 项目结构

```
server/
├── koa-server.js          # 主服务器入口
├── package.json            # 依赖配置
├── utils/
│   └── dataGenerator.js    # 数据生成工具
└── routes/                 # 路由模块
    ├── auth.js            # 认证路由
    ├── documents.js       # 文档路由
    ├── forms.js           # 表单路由
    ├── ai.js              # AI聊天路由
    └── admin.js           # 管理员路由
```

## 🚀 启动服务器

```bash
# 启动Koa服务器（推荐）
npm start

# 启动Express服务器（备用）
npm run express
```

## 📋 API端点

### 认证相关
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息

### 文档管理
- `GET /api/documents` - 获取文档列表
- `GET /api/documents/:id` - 获取单个文档
- `POST /api/documents` - 创建新文档
- `PATCH /api/documents/:id` - 更新文档
- `DELETE /api/documents/:id` - 删除文档

### 表单管理
- `GET /api/forms` - 获取表单列表
- `GET /api/forms/:id` - 获取单个表单
- `GET /api/forms/:id/structure` - 获取表单结构
- `POST /api/forms` - 创建新表单
- `PUT /api/forms/:id/structure` - 更新表单结构
- `PATCH /api/forms/:id` - 更新表单
- `DELETE /api/forms/:id` - 删除表单

### AI功能
- `POST /api/ai/chat` - AI聊天接口

### 管理员功能
- `POST /api/admin/reset-data` - 重置数据
- `GET /api/admin/stats` - 获取数据统计

## 🔧 模块说明

### 主服务器 (koa-server.js)
- 配置基础中间件（CORS、JSON解析、请求日志）
- 生成示例数据
- 注册所有路由模块
- 启动服务器

### 认证模块 (routes/auth.js)
- 用户登录验证
- JWT令牌管理
- 用户信息获取

### 文档模块 (routes/documents.js)
- 文档CRUD操作
- 文档搜索和过滤
- 回收站管理

### 表单模块 (routes/forms.js)
- 表单CRUD操作
- 表单结构管理
- 表单搜索和过滤

### AI模块 (routes/ai.js)
- OpenAI API集成
- 智能文档助手
- 上下文感知聊天

### 管理员模块 (routes/admin.js)
- 数据重置功能
- 系统统计信息
- 数据管理工具

## 🎯 特性

- ✅ 模块化架构，易于维护
- ✅ 完整的CRUD操作
- ✅ 随机数据生成
- ✅ 回收站功能
- ✅ AI聊天集成
- ✅ 请求日志记录
- ✅ 错误处理机制
- ✅ 数据统计功能

## 🔄 数据管理

服务器启动时会自动生成随机数据：
- 随机数量的文档和表单
- 随机删除状态（20%文档，15%表单被删除）
- 随机内容和标题
- 支持数据重置功能
