const Router = require('@koa/router');
const Document = require('../models/Document');
const User = require('../models/User');
const { generateId, nowIso } = require('../utils/dataGenerator');

const router = new Router();

/**
 * 获取文档列表
 * GET /api/docs
 * Query: trashed, search
 */
router.get('/api/docs', async (ctx) => {
  try {
    const { trashed, search, page = 1, limit = 20, sort = 'lastUpdated' } = ctx.query;
    console.log('trashed',trashed)
    const trashedBool = String(trashed).toLowerCase() === 'true';
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    
    // 构建查询条件
    const query = {
      type: 'DOC',
      isTrashed: trashedBool
    };
    
    // 搜索条件
    if (search && typeof search === 'string') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // 排序条件
    let sortOptions = {};
    if (sort === 'title') {
      sortOptions.title = 1;
    } else if (sort === 'lastUpdated') {
      sortOptions.lastUpdated = -1;
    } else {
      sortOptions.lastUpdated = -1;
    }
    
    // 执行查询
    const total = await Document.countDocuments(query);
    const documents = await Document.find(query)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('author', 'name email')
      .lean();
    
    const result = documents.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      lastUpdated: doc.lastUpdated,
      isTrashed: doc.isTrashed,
      type: doc.type,
      author: doc.author
    }));
    
    ctx.body = {
      data: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    };
  } catch (error) {
    console.error('获取文档列表失败:', error);
    ctx.status = 500;
    ctx.body = { message: '获取文档列表失败' };
  }
});

/**
 * 获取单个文档
 * GET /api/docs/:id
 */
router.get('/api/docs/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    console.log('获取文档ID:', id);
    
    const document = await Document.findById(id)
      .populate('author', 'name email')
      .lean();
    
    console.log('查询结果:', document ? '找到文档' : '未找到文档');
    
    if (!document) {
      ctx.status = 404;
      ctx.body = { message: 'Document not found' };
      return;
    }
    
    if (document.type !== 'DOC') {
      ctx.status = 400;
      ctx.body = { message: 'Not a document' };
      return;
    }
    
    ctx.body = {
      id: document._id.toString(),
      title: document.title,
      content: document.content,
      lastUpdated: document.lastUpdated,
      isTrashed: document.isTrashed,
      type: document.type,
      author: document.author
    };
  } catch (error) {
    console.error('获取文档失败:', error);
    ctx.status = 500;
    ctx.body = { message: '获取文档失败' };
  }
});

/**
 * 创建新文档
 * POST /api/docs
 */
router.post('/api/docs', async (ctx) => {
  const documents = ctx.app.context.documents;
  const { title } = ctx.request.body || {};
  
  if (!title || typeof title !== 'string') {
    ctx.status = 400;
    ctx.body = { message: 'title is required' };
    return;
  }
  
  const id = generateId('doc');
  const newDoc = { 
    id, 
    title, 
    content: '', 
    lastUpdated: nowIso(), 
    isTrashed: false,
    type: 'DOC'
  };
  
  documents.set(id, newDoc);
  ctx.status = 201;
  ctx.body = newDoc;
});

/**
 * 更新文档
 * PATCH /api/docs/:id
 */
router.patch('/api/docs/:id', async (ctx) => {
  const documents = ctx.app.context.documents;
  const doc = documents.get(ctx.params.id);
  
  if (!doc) {
    ctx.status = 404;
    ctx.body = { message: 'Document not found' };
    return;
  }
  
  if (doc.type !== 'DOC') {
    ctx.status = 400;
    ctx.body = { message: 'Not a document' };
    return;
  }
  
  const { content, isTrashed } = ctx.request.body || {};
  
  if (typeof content !== 'undefined' && typeof content !== 'string') {
    ctx.status = 400;
    ctx.body = { message: 'content must be string' };
    return;
  }
  
  if (typeof isTrashed !== 'undefined' && typeof isTrashed !== 'boolean') {
    ctx.status = 400;
    ctx.body = { message: 'isTrashed must be boolean' };
    return;
  }
  
  if (typeof content === 'string') doc.content = content;
  if (typeof isTrashed === 'boolean') doc.isTrashed = isTrashed;
  
  doc.lastUpdated = nowIso();
  documents.set(doc.id, doc);
  ctx.body = doc;
});

/**
 * 永久删除文档
 * DELETE /api/docs/:id
 */
router.delete('/api/docs/:id', async (ctx) => {
  const documents = ctx.app.context.documents;
  const doc = documents.get(ctx.params.id);
  
  if (!doc) {
    ctx.status = 404;
    ctx.body = { message: 'Document not found' };
    return;
  }
  
  if (doc.type !== 'DOC') {
    ctx.status = 400;
    ctx.body = { message: 'Not a document' };
    return;
  }
  
  if (doc.isTrashed !== true) {
    ctx.status = 403;
    ctx.body = { message: 'Document must be trashed before permanent deletion' };
    return;
  }
  
  documents.delete(ctx.params.id);
  ctx.status = 204;
});

module.exports = router;
