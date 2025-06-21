// routes/userRoutes.js
const express = require('express');
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const auth    = require('../middleware/authMiddleware');
const tenant  = require('../middleware/tenantMiddleware');
const role    = require('../middleware/roleMiddleware');
const router  = express.Router();

// Lista todos os utilizadores do tenant (somente admin e super-admin)
router.get('/', auth, tenant, role('admin'), async (req, res) => {
  const users = await User.find(
    { tenantId: req.tenantId },
    'username role'
  );
  res.json(users);
});

// Registar novo utilizador (admin e super-admin)
router.post('/', auth, tenant, role('admin'), async (req, res) => {
  const { username, password, role: newRole } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const u = await User.create({
    username,
    passwordHash: hash,
    role: newRole,
    tenantId: req.tenantId
  });
  res.status(201).json({ _id: u._id, username: u.username, role: u.role });
});

module.exports = router;
