const express = require('express');
const cors = require('cors');

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

// seed sample documents
const seed = [
  { title: 'React 学习笔记', content: '<h1>React 学习笔记</h1><p>这是一个关于 React Hooks 的文档。</p>' },
  { title: '项目计划', content: '<h1>项目计划</h1><p>欢迎来到我们的项目计划文档。</p>' },
  { title: '会议纪要', content: '<h1>会议纪要</h1><p>在这里记录会议的重要内容。</p>' },
];
seed.forEach(s => {
  const id = generateId();
  documents.set(id, { id, title: s.title, content: s.content, lastUpdated: nowIso(), isTrashed: false });
});

// Base path: /api
const router = express.Router();

// GET /api/documents - list documents
router.get('/documents', (req, res) => {
  const { trashed, search } = req.query;
  const searchLower = typeof search === 'string' ? search.toLowerCase() : '';
  const trashedBool = String(trashed).toLowerCase() === 'true';
  const list = Array.from(documents.values())
    .filter(d => (trashedBool ? d.isTrashed === true : d.isTrashed === false))
    .filter(d => (searchLower ? (d.title || '').toLowerCase().includes(searchLower) : true))
    .map(d => ({ id: d.id, title: d.title, lastUpdated: d.lastUpdated, isTrashed: d.isTrashed }));
  res.status(200).json(list);
});

// GET /api/documents/:id - get single document
router.get('/documents/:id', (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not Found' });
  res.status(200).json(doc);
});

// POST /api/documents - create document
router.post('/documents', (req, res) => {
  const { title } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'title is required' });
  }
  const id = generateId();
  const newDoc = { id, title, content: '', lastUpdated: nowIso(), isTrashed: false };
  documents.set(id, newDoc);
  res.status(201).json(newDoc);
});

// PATCH /api/documents/:id - partial update document (content or isTrashed)
router.patch('/documents/:id', (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not Found' });
  const { content, isTrashed } = req.body || {};
  if (typeof content !== 'undefined' && typeof content !== 'string') {
    return res.status(400).json({ message: 'content must be string' });
  }
  if (typeof isTrashed !== 'undefined' && typeof isTrashed !== 'boolean') {
    return res.status(400).json({ message: 'isTrashed must be boolean' });
  }
  if (typeof content === 'string') {
    doc.content = content;
  }
  if (typeof isTrashed === 'boolean') {
    doc.isTrashed = isTrashed;
  }
  doc.lastUpdated = nowIso();
  documents.set(doc.id, doc);
  res.status(200).json(doc);
});

// DELETE /api/documents/:id - delete document
router.delete('/documents/:id', (req, res) => {
  const doc = documents.get(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not Found' });
  if (doc.isTrashed !== true) {
    return res.status(403).json({ message: 'Document must be trashed before permanent deletion' });
  }
  documents.delete(req.params.id);
  res.status(204).send();
});

app.use('/api', router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


