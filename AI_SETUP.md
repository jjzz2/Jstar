# AI Assistant Setup Guide

## Overview
The V5.0 upgrade includes an intelligent AI assistant that can help users with document-related tasks such as summarization, translation, and grammar checking.

## Features
- **General Conversations**: Available on all pages via the floating button in the bottom-right corner
- **Document Context Awareness**: When used in the editor, the AI can see and analyze the current document content
- **Professional UI**: Built with Ant Design components including Drawer, FloatButton, and chat interface
- **Real-time Chat**: Smooth conversation experience with message history

## Setup Instructions

### 1. AI API Key Configuration
To enable the AI assistant, you need to set up an AI service API key:

```bash
# Create a .env file in the server directory
cd server
echo "AI_API_KEY=your_openai_api_key_here" > .env
```

### 2. Supported AI Services
The current implementation uses OpenAI's GPT-3.5-turbo model, but you can easily adapt it for other services:

- **OpenAI**: Set `AI_API_KEY` to your OpenAI API key
- **Other Services**: Modify the API endpoint and request format in `server/server.js`

### 3. Environment Variables
```bash
# Server environment variables
AI_API_KEY=sk-your-openai-api-key-here
PORT=3001
```

### 4. Testing the AI Assistant
1. Start the server: `cd server && npm start`
2. Start the frontend: `npm start`
3. Click the robot icon (🤖) in the bottom-right corner
4. Try asking questions like:
   - "你好，你能做什么？"
   - In the editor: "总结一下这篇文档"
   - "帮我检查语法错误"

## API Endpoint
The AI assistant uses the `/api/ai/chat` endpoint:

```javascript
POST /api/ai/chat
{
  "prompt": "用户的问题",
  "context": "文档内容（可选）"
}
```

## Customization
You can customize the AI assistant by modifying:
- `src/components/AiAssistant.jsx` - UI and chat logic
- `server/server.js` - AI API integration and system prompts
- System prompt in Chinese for document assistance tasks

## Troubleshooting
- **"AI service not configured"**: Make sure `AI_API_KEY` is set in your environment
- **API errors**: Check your API key validity and quota
- **Network issues**: Ensure the server can reach the AI service endpoint

## Security Notes
- API keys are stored securely on the server side
- Frontend never directly accesses AI service APIs
- All requests go through the backend proxy for security
