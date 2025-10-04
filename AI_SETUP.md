# AI助手配置指南

## 🔑 环境变量配置

### 1. 创建环境变量文件
在项目根目录创建 `.env` 文件：

```bash
# AI配置 - DeepSeek API
AI_API_KEY=sk-c258183c615e449086f9a4f8ddd33896

# 服务器配置  
PORT=3001
NODE_ENV=development
```

### 2. DeepSeek API配置
项目已配置使用DeepSeek API，具有以下优势：
- 🚀 **更快的响应速度**
- 💰 **更低的成本**
- 🇨🇳 **更好的中文支持**
- 🔒 **数据安全可靠**

如需更换API密钥，请访问 [DeepSeek官网](https://platform.deepseek.com/) 获取新的API密钥。

## 🛠️ 安装依赖

项目已包含必要的依赖，无需额外安装：

```json
{
  "dependencies": {
    "koa": "^2.15.0",
    "@koa/router": "^12.0.1",
    "koa-bodyparser": "^4.4.1"
  }
}
```

## 🚀 启动服务

### 1. 启动后端服务器
```bash
cd server
npm install
npm start
```

### 2. 启动前端应用
```bash
npm install
npm start
```

## 📝 使用说明

1. 确保设置了 `AI_API_KEY` 环境变量
2. 启动服务器和前端应用
3. 在任意页面右下角点击机器人图标
4. 开始与AI助手对话

## 🔧 故障排除

### 常见问题：

1. **"AI service not configured"**
   - 检查是否设置了 `AI_API_KEY` 环境变量
   - 确保API密钥有效

2. **"AI助手暂时不可用"**
   - 检查网络连接
   - 验证API密钥权限
   - 查看服务器控制台错误信息

3. **API调用失败**
   - 检查OpenAI账户余额
   - 确认API密钥权限设置
   - 查看请求频率限制
