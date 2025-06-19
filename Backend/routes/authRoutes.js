const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const router  = express.Router();

// register (super-admin only)
router.post('/register', async (req, res) => {
  const { username, password, role, tenantId } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const u = await User.create({ username, passwordHash: hash, role, tenantId });
  res.status(201).json({ id: u._id, username: u.username });
});

// login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const u = await User.findOne({ username });
  if (!u || !await bcrypt.compare(password, u.passwordHash))
    return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = jwt.sign(
    { userId: u._id, tenantId: u.tenantId, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES_IN }
  );
  res.json({ token });
});

module.exports = router;
