const Router = require('@koa/router');
const { generateId, nowIso } = require('../utils/dataGenerator');

const router = new Router();

/**
 * 获取表单列表
 * GET /api/forms
 * Query: trashed, search, page, limit, sort
 */
router.get('/api/forms', async (ctx) => {
  const documents = ctx.app.context.documents;
  const { trashed, search, page = 1, limit = 20, sort = 'lastUpdated' } = ctx.query;
  
  const searchLower = typeof search === 'string' ? search.toLowerCase() : '';
  const trashedBool = String(trashed).toLowerCase() === 'true';
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  
  let list = Array.from(documents.values())
    .filter(d => d.type === 'FORM')
    .filter(d => (trashedBool ? d.isTrashed === true : d.isTrashed === false))
    .filter(d => (searchLower ? (d.title || '').toLowerCase().includes(searchLower) : true));
  
  // 排序
  if (sort === 'title') {
    list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  } else if (sort === 'lastUpdated') {
    list.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  }
  
  // 分页
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const paginatedList = list.slice(start, end);
  
  const result = paginatedList.map(d => {
    let description = '';
    try {
      const formData = JSON.parse(d.content);
      description = formData.description || '';
    } catch (e) {
      description = '';
    }
    
    return { 
      id: d.id, 
      title: d.title, 
      description,
      lastUpdated: d.lastUpdated, 
      isTrashed: d.isTrashed,
      type: d.type 
    };
  });
  
  ctx.body = {
    data: result,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: list.length,
      pages: Math.ceil(list.length / limitNum)
    }
  };
});

/**
 * 获取单个表单
 * GET /api/forms/:id
 */
router.get('/api/forms/:id', async (ctx) => {
  const documents = ctx.app.context.documents;
  const form = documents.get(ctx.params.id);
  
  if (!form) {
    ctx.status = 404;
    ctx.body = { message: 'Form not found' };
    return;
  }
  
  if (form.type !== 'FORM') {
    ctx.status = 400;
    ctx.body = { message: 'Not a form' };
    return;
  }
  
  ctx.body = form;
});

/**
 * 获取表单结构
 * GET /api/forms/:id/structure
 */
router.get('/api/forms/:id/structure', async (ctx) => {
  const documents = ctx.app.context.documents;
  const form = documents.get(ctx.params.id);
  
  if (!form) {
    ctx.status = 404;
    ctx.body = { message: 'Form not found' };
    return;
  }
  
  if (form.type !== 'FORM') {
    ctx.status = 400;
    ctx.body = { message: 'Not a form' };
    return;
  }
  
  try {
    const formData = JSON.parse(form.content);
    ctx.body = formData;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { message: 'Invalid form data' };
  }
});

/**
 * 创建新表单
 * POST /api/forms
 */
router.post('/api/forms', async (ctx) => {
  const documents = ctx.app.context.documents;
  const { title, description } = ctx.request.body || {};
  
  if (!title || typeof title !== 'string') {
    ctx.status = 400;
    ctx.body = { message: 'title is required' };
    return;
  }
  
  const id = generateId('form');
  const formData = {
    title,
    description: description || '',
    questions: []
  };
  
  const newForm = { 
    id, 
    title, 
    content: JSON.stringify(formData), 
    lastUpdated: nowIso(), 
    isTrashed: false,
    type: 'FORM'
  };
  
  documents.set(id, newForm);
  ctx.status = 201;
  ctx.body = newForm;
});

/**
 * 更新表单结构
 * PUT /api/forms/:id/structure
 */
router.put('/api/forms/:id/structure', async (ctx) => {
  const documents = ctx.app.context.documents;
  const form = documents.get(ctx.params.id);
  
  if (!form) {
    ctx.status = 404;
    ctx.body = { message: 'Form not found' };
    return;
  }
  
  if (form.type !== 'FORM') {
    ctx.status = 400;
    ctx.body = { message: 'Not a form' };
    return;
  }
  
  const { formData } = ctx.request.body;
  if (!formData || typeof formData !== 'object') {
    ctx.status = 400;
    ctx.body = { message: 'formData is required and must be an object' };
    return;
  }
  
  form.content = JSON.stringify(formData);
  form.lastUpdated = nowIso();
  documents.set(form.id, form);
  ctx.body = form;
});

/**
 * 更新表单
 * PATCH /api/forms/:id
 */
router.patch('/api/forms/:id', async (ctx) => {
  const documents = ctx.app.context.documents;
  const form = documents.get(ctx.params.id);
  
  if (!form) {
    ctx.status = 404;
    ctx.body = { message: 'Form not found' };
    return;
  }
  
  if (form.type !== 'FORM') {
    ctx.status = 400;
    ctx.body = { message: 'Not a form' };
    return;
  }
  
  const { content, isTrashed, formData } = ctx.request.body || {};
  
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
  
  if (typeof formData !== 'undefined') {
    if (typeof formData !== 'object' || formData === null) {
      ctx.status = 400;
      ctx.body = { message: 'formData must be an object' };
      return;
    }
    form.content = JSON.stringify(formData);
  }
  
  if (typeof content === 'string') form.content = content;
  if (typeof isTrashed === 'boolean') form.isTrashed = isTrashed;
  
  form.lastUpdated = nowIso();
  documents.set(form.id, form);
  ctx.body = form;
});

/**
 * 永久删除表单
 * DELETE /api/forms/:id
 */
router.delete('/api/forms/:id', async (ctx) => {
  const documents = ctx.app.context.documents;
  const form = documents.get(ctx.params.id);
  
  if (!form) {
    ctx.status = 404;
    ctx.body = { message: 'Form not found' };
    return;
  }
  
  if (form.type !== 'FORM') {
    ctx.status = 400;
    ctx.body = { message: 'Not a form' };
    return;
  }
  
  if (form.isTrashed !== true) {
    ctx.status = 403;
    ctx.body = { message: 'Form must be trashed before permanent deletion' };
    return;
  }
  
  documents.delete(ctx.params.id);
  ctx.status = 204;
});

/**
 * 批量操作表单
 * POST /api/forms/batch
 */
router.post('/api/forms/batch', async (ctx) => {
  const documents = ctx.app.context.documents;
  const { action, ids } = ctx.request.body;
  
  if (!Array.isArray(ids) || ids.length === 0) {
    ctx.status = 400;
    ctx.body = { message: 'ids must be a non-empty array' };
    return;
  }
  
  const results = [];
  
  for (const id of ids) {
    const form = documents.get(id);
    if (!form || form.type !== 'FORM') {
      results.push({ id, success: false, error: 'Form not found' });
      continue;
    }
    
    try {
      switch (action) {
        case 'trash':
          form.isTrashed = true;
          form.lastUpdated = nowIso();
          documents.set(id, form);
          results.push({ id, success: true });
          break;
        case 'restore':
          form.isTrashed = false;
          form.lastUpdated = nowIso();
          documents.set(id, form);
          results.push({ id, success: true });
          break;
        case 'delete':
          if (form.isTrashed) {
            documents.delete(id);
            results.push({ id, success: true });
          } else {
            results.push({ id, success: false, error: 'Form must be trashed first' });
          }
          break;
        default:
          results.push({ id, success: false, error: 'Invalid action' });
      }
    } catch (error) {
      results.push({ id, success: false, error: error.message });
    }
  }
  
  ctx.body = { results };
});

/**
 * 获取表单统计信息
 * GET /api/forms/stats
 */
router.get('/api/forms/stats', async (ctx) => {
  const documents = ctx.app.context.documents;
  
  const forms = Array.from(documents.values()).filter(d => d.type === 'FORM');
  
  const stats = {
    total: forms.length,
    active: forms.filter(f => !f.isTrashed).length,
    trashed: forms.filter(f => f.isTrashed).length,
    recent: forms
      .filter(f => !f.isTrashed)
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, 5)
      .map(f => ({
        id: f.id,
        title: f.title,
        lastUpdated: f.lastUpdated
      }))
  };
  
  ctx.body = stats;
});

/**
 * 复制表单
 * POST /api/forms/:id/copy
 */
router.post('/api/forms/:id/copy', async (ctx) => {
  const documents = ctx.app.context.documents;
  const originalForm = documents.get(ctx.params.id);
  
  if (!originalForm) {
    ctx.status = 404;
    ctx.body = { message: 'Form not found' };
    return;
  }
  
  if (originalForm.type !== 'FORM') {
    ctx.status = 400;
    ctx.body = { message: 'Not a form' };
    return;
  }
  
  const { title } = ctx.request.body || {};
  const newId = generateId('form');
  
  let formData;
  try {
    formData = JSON.parse(originalForm.content);
  } catch (e) {
    formData = { title: originalForm.title, description: '', questions: [] };
  }
  
  const newForm = {
    id: newId,
    title: title || `${originalForm.title} (副本)`,
    content: JSON.stringify({
      ...formData,
      title: title || `${originalForm.title} (副本)`
    }),
    lastUpdated: nowIso(),
    isTrashed: false,
    type: 'FORM'
  };
  
  documents.set(newId, newForm);
  ctx.status = 201;
  ctx.body = newForm;
});

module.exports = router;
