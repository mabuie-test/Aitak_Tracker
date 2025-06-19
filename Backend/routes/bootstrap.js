const express = require('express');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const router  = express.Router();

router.post('/', async (req, res) => {
  if (req.query.secret !== process.env.BOOTSTRAP_SECRET)
    return res.status(403).json({ error: 'Forbidden' });
  const exists = await User.countDocuments({ role: 'super-admin' });
  if (exists) return res.status(409).json({ error: 'Já existe super-admin' });
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Dados obrigatórios' });
  const hash = await bcrypt.hash(password, 10);
  const u = await User.create({ username, passwordHash: hash, role: 'super-admin' });
  res.status(201).json({ id: u._id, username: u.username });
});

module.exports = router;
