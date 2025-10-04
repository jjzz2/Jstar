// 加载配置
const config = require('./config');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const json = require('koa-json');
const connectDB = require('./config/database');
const seedDatabase = require('./utils/seedData');
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

// 连接数据库并初始化数据
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    
    // 生成示例数据并存储到上下文（临时保留，用于兼容性）
    const documents = generateSampleData();
    app.context.documents = documents;
    
    console.log('🚀 服务器启动完成');
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();

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
        'GET /api/docs',
        'GET /api/forms', 
        'POST /api/auth/login',
        'GET /api/auth/profile',
        'POST /api/ai/chat',
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
});

module.exports = app;
