const Router = require('@koa/router');
const { generateSampleData } = require('../utils/dataGenerator');

const router = new Router();

/**
 * 重置数据
 * POST /api/admin/reset-data
 */
router.post('/api/admin/reset-data', async (ctx) => {
  try {
    const documents = ctx.app.context.documents;
    const newDocuments = generateSampleData();
    
    // 清空现有数据并添加新数据
    documents.clear();
    newDocuments.forEach((value, key) => {
      documents.set(key, value);
    });
    
    const docCount = Array.from(documents.values()).filter(d => d.type === 'DOC').length;
    const formCount = Array.from(documents.values()).filter(d => d.type === 'FORM').length;
    
    ctx.body = { 
      message: '数据已重置',
      stats: {
        total: documents.size,
        documents: docCount,
        forms: formCount
      }
    };
  } catch (error) {
    console.error('Reset data error:', error);
    ctx.status = 500;
    ctx.body = { error: '重置数据失败' };
  }
});

/**
 * 获取数据统计
 * GET /api/admin/stats
 */
router.get('/api/admin/stats', async (ctx) => {
  const documents = ctx.app.context.documents;
  const allItems = Array.from(documents.values());
  
  const stats = {
    total: allItems.length,
    documents: allItems.filter(d => d.type === 'DOC').length,
    forms: allItems.filter(d => d.type === 'FORM').length,
    trashed: allItems.filter(d => d.isTrashed).length,
    active: allItems.filter(d => !d.isTrashed).length
  };
  
  ctx.body = stats;
});

module.exports = router;

