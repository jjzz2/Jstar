const Router = require('@koa/router');
const Form = require('../models/Form');
const User = require('../models/User');
const { generateId, nowIso } = require('../utils/dataGenerator');

const router = new Router();

/**
 * 获取表单列表
 * GET /api/forms
 * Query: trashed, search, page, limit, sort
 */
router.get('/api/forms', async (ctx) => {
  try {
    const { trashed, search, page = 1, limit = 20, sort = 'lastUpdated' } = ctx.query;
    
    const trashedBool = String(trashed).toLowerCase() === 'true';
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    
    // 构建查询条件
    const query = {
      isTrashed: trashedBool
    };
    
    // 搜索条件
    if (search && typeof search === 'string') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
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
    const total = await Form.countDocuments(query);
    const forms = await Form.find(query)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('author', 'name email')
      .lean();
    
    const result = forms.map(form => {
      let description = '';
      try {
        const formData = JSON.parse(form.content);
        description = formData.description || '';
      } catch (e) {
        description = form.description || '';
      }
      
      return {
        id: form._id.toString(),
        title: form.title,
        description,
        lastUpdated: form.lastUpdated,
        isTrashed: form.isTrashed,
        type: 'FORM',
        author: form.author
      };
    });
    
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
    console.error('获取表单列表失败:', error);
    ctx.status = 500;
    ctx.body = { message: '获取表单列表失败' };
  }
});

/**
 * 获取表单统计信息
 * GET /api/forms/stats
 */
router.get('/api/forms/stats', async (ctx) => {
  try {
    const total = await Form.countDocuments({ type: 'FORM' });
    const active = await Form.countDocuments({ type: 'FORM', isTrashed: false });
    const trashed = await Form.countDocuments({ type: 'FORM', isTrashed: true });
    
    const recent = await Form.find({ 
      type: 'FORM', 
      isTrashed: false 
    })
    .sort({ lastUpdated: -1 })
    .limit(5)
    .select('title lastUpdated')
    .lean();
    
    const stats = {
      total,
      active,
      trashed,
      recent: recent.map(f => ({
        id: f._id.toString(),
        title: f.title,
        lastUpdated: f.lastUpdated
      }))
    };
    
    ctx.body = stats;
  } catch (error) {
    console.error('获取表单统计失败:', error);
    ctx.status = 500;
    ctx.body = { message: '获取表单统计失败' };
  }
});

/**
 * 获取单个表单
 * GET /api/forms/:id
 */
router.get('/api/forms/:id', async (ctx) => {
  try {
    const { id } = ctx.params;
    
    const form = await Form.findById(id)
      .populate('author', 'name email')
      .lean();
    
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
    
    ctx.body = {
      id: form._id.toString(),
      title: form.title,
      description: form.description,
      content: form.content,
      lastUpdated: form.lastUpdated,
      isTrashed: form.isTrashed,
      type: form.type,
      author: form.author
    };
  } catch (error) {
    console.error('获取表单失败:', error);
    ctx.status = 500;
    ctx.body = { message: '获取表单失败' };
  }
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
