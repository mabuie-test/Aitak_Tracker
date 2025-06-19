const express = require('express');
const User    = require('../models/User');
const auth    = require('../middleware/authMiddleware');
const tenant  = require('../middleware/tenantMiddleware');
const role    = require('../middleware/roleMiddleware');
const bcrypt  = require('bcryptjs');
const router  = express.Router();

// list users (admin)
router.get('/', auth, tenant, role('admin'), async (req, res) => {
  const list = await User.find({ tenantId: req.tenantId }, 'username role');
  res.json(list);
});

// get user
router.get('/:id', auth, tenant, role('admin'), async (req, res) => {
  const u = await User.findOne({ _id: req.params.id, tenantId: req.tenantId }, 'username role');
  if (!u) return res.status(404).json({ error: 'Não encontrado' });
  res.json(u);
});

// update user (role)
router.put('/:id', auth, tenant, role('admin'), async (req, res) => {
  const u = await User.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.tenantId },
    { role: req.body.role },
    { new: true }
  );
  if (!u) return res.status(404).json({ error: 'Não encontrado' });
  res.json(u);
});

module.exports = router;
