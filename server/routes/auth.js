const express = require('express');
const router = express.Router();

const users = {
  'user-1': { id: 'user-1', name: 'Admin', username: 'admin', password: 'password' },
};
const VALID_TOKEN = 'fake-jwt-token';

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users['user-1'];
  if (username === user.username && password === user.password) {
    return res.status(200).json({ token: VALID_TOKEN, user: { id: user.id, name: user.name } });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

router.get('/profile', (req, res) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token === VALID_TOKEN) {
    const user = users['user-1'];
    return res.status(200).json({ id: user.id, name: user.name });
  }
  return res.status(401).json({ message: 'Unauthorized' });
});

module.exports = router;


