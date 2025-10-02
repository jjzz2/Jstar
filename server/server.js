const express = require('express');
const cors = require('cors');
const { faker } = require('@faker-js/faker');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory database
// document shape: { id, title, content, lastUpdated, isTrashed }
const documents = new Map();

function nowIso() {
  return new Date().toISOString();
}

function generateId() {
  return `doc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// Generate realistic sample documents using faker
function generateSampleDocuments() {
  const documentCount = 8; // Generate 8 sample documents
  
  for (let i = 0; i < documentCount; i++) {
    const id = generateId();
    const title = faker.lorem.sentence({ min: 3, max: 8 }).replace('.', '');
    const paragraphCount = faker.number.int({ min: 2, max: 5 });
    const content = `<h1>${title}</h1>${faker.lorem.paragraphs(paragraphCount, '<p>%s</p>')}`;
    const lastUpdated = faker.date.past({ years: 0.5 }).toISOString(); // Within last 6 months
    const isTrashed = faker.datatype.boolean({ probability: 0.1 }); // 10% chance of being trashed
    
    documents.set(id, { 
      id, 
      title, 
      content, 
      lastUpdated, 
      isTrashed 
    });
  }
}

// Generate sample documents on server startup
generateSampleDocuments();

// attach locals and mount routers
app.locals.documents = documents;
app.locals.generateId = generateId;

const authRouter = require('./routes/auth');
const docsRouter = require('./routes/documents');

app.use('/api/auth', authRouter);
app.use('/api/documents', docsRouter);

// AI Chat API endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Check if AI API key is configured
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'AI service not configured. Please set AI_API_KEY environment variable.' 
      });
    }

    // Construct the message for the AI
    let messages = [
      {
        role: 'system',
        content: '你是一个智能文档助手，可以帮助用户处理文档相关的任务，如总结、翻译、语法检查等。请用中文回复。'
      }
    ];

    // Add context if provided (for document-aware conversations)
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

    // Example using OpenAI API format (you can adapt this for other AI services)
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices[0]?.message?.content || '抱歉，我无法处理您的请求。';

    res.json({ reply });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      error: '抱歉，AI服务暂时不可用。请稍后再试。',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


