const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const json = require('koa-json');
const { generateSampleData } = require('./utils/dataGenerator');

// 导入路由模块
const authRoutes = require('./routes/auth');
const docsRoutes = require('./routes/documents');
const formsRoutes = require('./routes/forms');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

const app = new Koa();

// 基础中间件配置
app.use(cors());
app.use(bodyParser());
app.use(json());

// 请求日志中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  console.log(`${ctx.method} ${ctx.url} - ${ctx.ip}`);
  
  try {
    await next();
  } catch (err) {
    console.error('Request error:', err);
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
  
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
});

// 生成示例数据并存储到上下文
const documents = generateSampleData();
app.context.documents = documents;

// 应用路由
app.use(authRoutes.routes());
app.use(authRoutes.allowedMethods());
app.use(docsRoutes.routes());
app.use(docsRoutes.allowedMethods());
app.use(formsRoutes.routes());
app.use(formsRoutes.allowedMethods());
app.use(aiRoutes.routes());
app.use(aiRoutes.allowedMethods());
app.use(adminRoutes.routes());
app.use(adminRoutes.allowedMethods());

// 根路径处理
app.use(async (ctx, next) => {
  if (ctx.path === '/') {
    ctx.body = { 
      message: 'Koa server is running', 
      timestamp: new Date().toISOString(),
      routes: [
        'GET /api/documents',
        'GET /api/forms', 
        'POST /api/auth/login',
        'GET /api/auth/profile',
        'POST /api/admin/reset-data'
      ]
    };
  } else {
    await next();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Koa server listening on http://localhost:${PORT}`);
  console.log(`📊 Generated ${documents.size} items (${Array.from(documents.values()).filter(d => d.type === 'DOC').length} docs, ${Array.from(documents.values()).filter(d => d.type === 'FORM').length} forms)`);
});

module.exports = app;
