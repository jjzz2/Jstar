# 腾讯文档克隆项目

一个现代化的文档协作平台，集成AI智能助手，支持文档创建、编辑、协作和本地文件管理。

## 🚀 功能特性

### 核心功能
- **文档管理**: 创建、编辑、删除文档
- **本地文件支持**: 打开本地文件并在编辑器中编辑
- **AI智能助手**: 集成DeepSeek AI，提供智能写作辅助
- **表单构建器**: 可视化表单设计工具
- **实时协作**: 多人在线编辑支持
- **回收站**: 文档和表单的软删除管理

### 技术特性
- **响应式设计**: 支持桌面端和移动端
- **现代化UI**: 基于Ant Design的优雅界面
- **性能优化**: 代码分割、懒加载、缓存优化
- **可访问性**: 支持键盘导航、屏幕阅读器
- **错误处理**: 完善的错误边界和用户反馈

## 🛠 技术栈

### 前端
- **React 19**: 最新版本的React框架
- **Vite**: 快速的构建工具和开发服务器
- **Ant Design**: 企业级UI组件库
- **Redux Toolkit**: 状态管理
- **React Router**: 路由管理
- **ahooks**: React Hooks工具库
- **Axios**: HTTP客户端

### 后端
- **Node.js**: JavaScript运行时
- **Koa.js**: 轻量级Web框架
- **MongoDB**: NoSQL数据库
- **Mongoose**: MongoDB对象建模工具
- **OpenAI API**: AI智能助手集成

## 📦 安装和运行

### 环境要求
- Node.js >= 18.0.0
- MongoDB >= 4.4
- npm >= 8.0.0

### 安装依赖
```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
```

### 配置环境变量
在 `server/config.js` 中配置：
```javascript
module.exports = {
  AI_API_KEY: 'your-deepseek-api-key',
  PORT: 3001,
  NODE_ENV: 'development'
};
```

### 启动项目
```bash
# 开发模式（同时启动前后端）
npm run dev:full

# 或者分别启动
npm run dev          # 启动前端
npm run server:dev   # 启动后端
```

### 构建生产版本
```bash
npm run build
```

## 📁 项目结构

```
tencent-docs-clone/
├── src/                    # 前端源码
│   ├── components/         # 可复用组件
│   ├── pages/             # 页面组件
│   ├── hooks/             # 自定义Hooks
│   ├── services/          # API服务
│   ├── store/             # Redux状态管理
│   ├── utils/             # 工具函数
│   └── router/            # 路由配置
├── server/                # 后端源码
│   ├── routes/            # API路由
│   ├── models/            # 数据模型
│   ├── utils/             # 工具函数
│   └── config/            # 配置文件
├── public/                # 静态资源
└── build/                 # 构建输出
```

## 🎯 主要功能

### 文档管理
- 创建和编辑富文本文档
- 支持Markdown格式
- 文档版本控制
- 文档分享和协作

### 本地文件支持
- 支持打开本地文件（.txt, .md, .doc, .docx, .pdf）
- 文件内容自动解析
- 本地文件与在线文档分离管理

### AI智能助手
- 基于DeepSeek API的智能写作辅助
- 文档内容生成和优化
- 智能问答和总结

### 表单构建器
- 拖拽式表单设计
- 多种表单组件支持
- 表单数据收集和管理

## 🔧 开发指南

### 代码规范
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 遵循React最佳实践
- 组件化开发

### 性能优化
- 代码分割和懒加载
- 图片和资源优化
- 缓存策略
- 响应式设计

### 可访问性
- 键盘导航支持
- 屏幕阅读器兼容
- 高对比度模式
- 减少动画选项

## 📝 API文档

### 文档相关API
- `GET /api/docs` - 获取文档列表
- `POST /api/docs` - 创建文档
- `GET /api/docs/:id` - 获取单个文档
- `PATCH /api/docs/:id` - 更新文档
- `DELETE /api/docs/:id` - 删除文档

### AI助手API
- `POST /api/ai/chat` - AI对话接口

### 表单相关API
- `GET /api/forms` - 获取表单列表
- `POST /api/forms` - 创建表单
- `GET /api/forms/:id` - 获取单个表单

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Ant Design](https://ant.design/) - UI组件库
- [Koa.js](https://koajs.com/) - Web框架
- [MongoDB](https://www.mongodb.com/) - 数据库
- [DeepSeek](https://www.deepseek.com/) - AI服务

