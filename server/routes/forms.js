const express = require('express');
const router = express.Router();

// Helper function to get current timestamp
function nowIso() { 
  return new Date().toISOString(); 
}

// Get all forms (with optional filtering)
router.get('/', (req, res) => {
  const documents = req.app.locals.documents;
  const { trashed, search } = req.query;
  const searchLower = typeof search === 'string' ? search.toLowerCase() : '';
  const trashedBool = String(trashed).toLowerCase() === 'true';
  
  const list = Array.from(documents.values())
    .filter(d => d.type === 'FORM') // Only forms
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

// Get specific form by ID
router.get('/:id', (req, res) => {
  const documents = req.app.locals.documents;
  const form = documents.get(req.params.id);
  
  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }
  
  if (form.type !== 'FORM') {
    return res.status(400).json({ message: 'Not a form' });
  }
  
  res.status(200).json(form);
});

// Create new form
router.post('/', (req, res) => {
  const documents = req.app.locals.documents;
  const generateId = req.app.locals.generateId;
  const { title, description } = req.body || {};
  
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ message: 'title is required' });
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
  res.status(201).json(newForm);
});

// Update form content (form structure)
router.patch('/:id', (req, res) => {
  const documents = req.app.locals.documents;
  const form = documents.get(req.params.id);
  
  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }
  
  if (form.type !== 'FORM') {
    return res.status(400).json({ message: 'Not a form' });
  }
  
  const { content, isTrashed, formData } = req.body || {};
  
  // Validate content if provided
  if (typeof content !== 'undefined' && typeof content !== 'string') {
    return res.status(400).json({ message: 'content must be string' });
  }
  
  // Validate isTrashed if provided
  if (typeof isTrashed !== 'undefined' && typeof isTrashed !== 'boolean') {
    return res.status(400).json({ message: 'isTrashed must be boolean' });
  }
  
  // Validate formData if provided
  if (typeof formData !== 'undefined') {
    if (typeof formData !== 'object' || formData === null) {
      return res.status(400).json({ message: 'formData must be an object' });
    }
    form.content = JSON.stringify(formData);
  }
  
  // Update content if provided
  if (typeof content === 'string') {
    form.content = content;
  }
  
  // Update trash status if provided
  if (typeof isTrashed === 'boolean') {
    form.isTrashed = isTrashed;
  }
  
  form.lastUpdated = nowIso();
  documents.set(form.id, form);
  res.status(200).json(form);
});

// Delete form permanently
router.delete('/:id', (req, res) => {
  const documents = req.app.locals.documents;
  const form = documents.get(req.params.id);
  
  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }
  
  if (form.type !== 'FORM') {
    return res.status(400).json({ message: 'Not a form' });
  }
  
  if (form.isTrashed !== true) {
    return res.status(403).json({ 
      message: 'Form must be trashed before permanent deletion' 
    });
  }
  
  documents.delete(req.params.id);
  res.status(204).send();
});

// Get form structure (parsed JSON)
router.get('/:id/structure', (req, res) => {
  const documents = req.app.locals.documents;
  const form = documents.get(req.params.id);
  
  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }
  
  if (form.type !== 'FORM') {
    return res.status(400).json({ message: 'Not a form' });
  }
  
  try {
    const formData = JSON.parse(form.content);
    res.status(200).json(formData);
  } catch (error) {
    res.status(500).json({ message: 'Invalid form data' });
  }
});

// Update form structure
router.put('/:id/structure', (req, res) => {
  const documents = req.app.locals.documents;
  const form = documents.get(req.params.id);
  
  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }
  
  if (form.type !== 'FORM') {
    return res.status(400).json({ message: 'Not a form' });
  }
  
  const { formData } = req.body;
  
  if (!formData || typeof formData !== 'object') {
    return res.status(400).json({ message: 'formData is required and must be an object' });
  }
  
  form.content = JSON.stringify(formData);
  form.lastUpdated = nowIso();
  documents.set(form.id, form);
  
  res.status(200).json(form);
});

module.exports = router;
