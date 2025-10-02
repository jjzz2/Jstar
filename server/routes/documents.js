const express = require('express');
const router = express.Router();

// simple in-memory storage passed in via app locals
function nowIso() { return new Date().toISOString(); }

router.get('/', (req, res) => {
  const documents = req.app.locals.documents;
  const { trashed, search } = req.query;
  const searchLower = typeof search === 'string' ? search.toLowerCase() : '';
  const trashedBool = String(trashed).toLowerCase() === 'true';
  const list = Array.from(documents.values())
    .filter(d => d.type === 'DOC') // Only documents
    .filter(d => (trashedBool ? d.isTrashed === true : d.isTrashed === false))
    .filter(d => (searchLower ? (d.title || '').toLowerCase().includes(searchLower) : true))
    .map(d => ({ 
      id: d.id, 
      title: d.title, 
      lastUpdated: d.lastUpdated, 
      isTrashed: d.isTrashed,
      type: d.type 
    }));
  res.status(200).json(list);
});

router.get('/:id', (req, res) => {
  const documents = req.app.locals.documents;
  const doc = documents.get(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  if (doc.type !== 'DOC') return res.status(400).json({ message: 'Not a document' });
  res.status(200).json(doc);
});

router.post('/', (req, res) => {
  const documents = req.app.locals.documents;
  const generateId = req.app.locals.generateId;
  const { title } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'title is required' });
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
  res.status(201).json(newDoc);
});

router.patch('/:id', (req, res) => {
  const documents = req.app.locals.documents;
  const doc = documents.get(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  if (doc.type !== 'DOC') return res.status(400).json({ message: 'Not a document' });
  
  const { content, isTrashed } = req.body || {};
  if (typeof content !== 'undefined' && typeof content !== 'string') {
    return res.status(400).json({ message: 'content must be string' });
  }
  if (typeof isTrashed !== 'undefined' && typeof isTrashed !== 'boolean') {
    return res.status(400).json({ message: 'isTrashed must be boolean' });
  }
  if (typeof content === 'string') doc.content = content;
  if (typeof isTrashed === 'boolean') doc.isTrashed = isTrashed;
  doc.lastUpdated = nowIso();
  documents.set(doc.id, doc);
  res.status(200).json(doc);
});

router.delete('/:id', (req, res) => {
  const documents = req.app.locals.documents;
  const doc = documents.get(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Document not found' });
  if (doc.type !== 'DOC') return res.status(400).json({ message: 'Not a document' });
  if (doc.isTrashed !== true) {
    return res.status(403).json({ message: 'Document must be trashed before permanent deletion' });
  }
  documents.delete(req.params.id);
  res.status(204).send();
});

module.exports = router;


