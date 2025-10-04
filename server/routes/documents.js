const Router = require('@koa/router');
const { generateId, nowIso } = require('../utils/dataGenerator');

const router = new Router();

/**
 * 获取文档列表
 * GET /api/documents
 * Query: trashed, search
 */
router.get('/api/documents', async (ctx) => {
  const documents = ctx.app.context.documents;
  const { trashed, search } = ctx.query;
  
  const searchLower = typeof search === 'string' ? search.toLowerCase() : '';
  const trashedBool = String(trashed).toLowerCase() === 'true';
  
  const list = Array.from(documents.values())
    .filter(d => d.type === 'DOC')
    .filter(d => (trashedBool ? d.isTrashed === true : d.isTrashed === false))
    .filter(d => (searchLower ? (d.title || '').toLowerCase().includes(searchLower) : true))
    .map(d => ({ 
      id: d.id, 
      title: d.title, 
      lastUpdated: d.lastUpdated, 
      isTrashed: d.isTrashed,
      type: d.type 
    }));
  
  ctx.body = list;
});

/**
 * 获取单个文档
 * GET /api/documents/:id
 */
router.get('/api/documents/:id', async (ctx) => {
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
  
  ctx.body = doc;
});

/**
 * 创建新文档
 * POST /api/documents
 */
router.post('/api/documents', async (ctx) => {
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
 * PATCH /api/documents/:id
 */
router.patch('/api/documents/:id', async (ctx) => {
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
 * DELETE /api/documents/:id
 */
router.delete('/api/documents/:id', async (ctx) => {
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
