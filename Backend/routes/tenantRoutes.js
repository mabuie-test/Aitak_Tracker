// routes/tenantRoutes.js
const express = require('express');
const Tenant  = require('../models/Tenant');
const User    = require('../models/User');
const bcrypt  = require('bcryptjs');
const auth    = require('../middleware/authMiddleware');
const role    = require('../middleware/roleMiddleware');
const router  = express.Router();

// create tenant e atribuir administrador existente
router.post('/', auth, role('super-admin'), async (req, res) => {
  const { name, contactEmail, plan, adminUserId } = req.body;
  if (!adminUserId) {
    return res.status(400).json({ error: 'adminUserId é obrigatório' });
  }
  const tenant = await Tenant.create({ name, contactEmail, plan });
  // Atualiza o User para admin desse tenant
  const user = await User.findByIdAndUpdate(
    adminUserId,
    { role: 'admin', tenantId: tenant._id },
    { new: true }
  );
  if (!user) return res.status(404).json({ error: 'Usuario admin não encontrado' });
  res.status(201).json({ tenant, adminUser: { _id: user._id, username: user.username } });
});

module.exports = router;
