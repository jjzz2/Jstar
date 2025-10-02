# API 结构文档

## 概述
项目现在完全分离了文档和表单的API端点，提供了更清晰的架构和更好的可维护性。

## API 端点

### 📄 文档 API (`/api/documents`)
- `GET /api/documents` - 获取所有文档
- `GET /api/documents/:id` - 获取特定文档
- `POST /api/documents` - 创建新文档
- `PATCH /api/documents/:id` - 更新文档
- `DELETE /api/documents/:id` - 删除文档

### 📝 表单 API (`/api/forms`)
- `GET /api/forms` - 获取所有表单
- `GET /api/forms/:id` - 获取特定表单
- `GET /api/forms/:id/structure` - 获取表单结构（JSON格式）
- `POST /api/forms` - 创建新表单
- `PATCH /api/forms/:id` - 更新表单
- `PUT /api/forms/:id/structure` - 更新表单结构
- `DELETE /api/forms/:id` - 删除表单

### 🔐 认证 API (`/api/auth`)
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息

### 🤖 AI API (`/api/ai`)
- `POST /api/ai/chat` - AI聊天接口

## 数据类型区分

### 文档 (type: 'DOC')
```json
{
  "id": "doc_xxx",
  "title": "文档标题",
  "content": "<h1>HTML内容</h1>",
  "lastUpdated": "2025-01-01T00:00:00.000Z",
  "isTrashed": false,
  "type": "DOC"
}
```

### 表单 (type: 'FORM')
```json
{
  "id": "form_xxx",
  "title": "表单标题",
  "content": "{\"title\":\"表单标题\",\"description\":\"描述\",\"questions\":[]}",
  "lastUpdated": "2025-01-01T00:00:00.000Z",
  "isTrashed": false,
  "type": "FORM"
}
```

## 前端服务层

### 文档服务 (`src/services/docsService.js`)
- `fetchDocumentList()` - 获取文档列表
- `fetchDocument()` - 获取单个文档
- `createDocument()` - 创建文档
- `updateDocument()` - 更新文档
- `deleteDocument()` - 删除文档

### 表单服务 (`src/services/formsService.js`)
- `fetchFormList()` - 获取表单列表
- `fetchForm()` - 获取单个表单
- `fetchFormStructure()` - 获取表单结构
- `createForm()` - 创建表单
- `updateFormStructure()` - 更新表单结构
- `deleteForm()` - 删除表单

## 路由分离的优势

1. **清晰的职责分离**: 文档和表单有各自独立的API端点
2. **类型安全**: 每个端点只处理特定类型的数据
3. **更好的可维护性**: 可以独立修改文档或表单的逻辑
4. **扩展性**: 可以轻松添加新的数据类型
5. **错误处理**: 更精确的错误消息和状态码

## 测试

运行测试脚本验证API：
```bash
node test-api.js
```

## 启动服务

```bash
# 启动后端服务器
cd server
node server.js

# 启动前端应用
npm start
```
