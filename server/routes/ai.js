const Router = require('@koa/router');
const OpenAI = require('openai');
const router = new Router();

// 初始化OpenAI客户端
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.AI_API_KEY,
});

/**
 * AI聊天接口
 * POST /api/ai/chat
 */
router.post('/api/ai/chat', async (ctx) => {
  try {
    const { prompt, context } = ctx.request.body;
    
    if (!prompt) {
      ctx.status = 400;
      ctx.body = { error: 'Prompt is required' };
      return;
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      ctx.status = 500;
      ctx.body = { 
        error: 'AI service not configured. Please set AI_API_KEY environment variable.' 
      };
      return;
    }

    let messages = [
      {
        role: 'system',
        content: '你是一个智能文档助手，可以帮助用户处理文档相关的任务，如总结、翻译、语法检查等。请用中文回复。'
      }
    ];

    if (context) {
      messages.push({
        role: 'system',
        content: `当前文档内容：\n${context}`
      });
    }

    messages.push({
      role: 'user',
      content: prompt
    });

    // 使用官方SDK调用DeepSeek API
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content || '抱歉，我无法处理您的请求。';

    ctx.body = { reply };
  } catch (error) {
    console.error('AI Chat error:', error);
    ctx.status = 500;
    ctx.body = { 
      error: '抱歉，AI服务暂时不可用。请稍后再试。',
      details: error.message 
    };
  }
});

module.exports = router;
