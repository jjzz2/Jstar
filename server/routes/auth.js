const Router = require('@koa/router');
const router = new Router();

// 用户数据
const users = {
  'user-1': { 
    id: 'user-1', 
    name: 'Admin', 
    username: 'admin', 
    password: 'password' 
  },
};

const VALID_TOKEN = 'fake-jwt-token';

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/api/auth/login', async (ctx) => {
  const { username, password } = ctx.request.body || {};
  
  if (!username || !password) {
    ctx.status = 400;
    ctx.body = { message: 'Username and password are required' };
    return;
  }
  
  const user = users['user-1'];
  if (username === user.username && password === user.password) {
    ctx.body = { 
      token: VALID_TOKEN, 
      user: { id: user.id, name: user.name } 
    };
  } else {
    ctx.status = 401;
    ctx.body = { message: 'Invalid credentials' };
  }
});

/**
 * 获取用户信息
 * GET /api/auth/profile
 */
router.get('/api/auth/profile', async (ctx) => {
  const auth = ctx.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  
  if (token === VALID_TOKEN) {
    const user = users['user-1'];
    ctx.body = { id: user.id, name: user.name };
  } else {
    ctx.status = 401;
    ctx.body = { message: 'Unauthorized' };
  }
});

module.exports = router;

