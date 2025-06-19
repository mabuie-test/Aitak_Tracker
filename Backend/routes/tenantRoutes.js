const express = require('express');
const Tenant  = require('../models/Tenant');
const auth    = require('../middleware/authMiddleware');
const role    = require('../middleware/roleMiddleware');
const router  = express.Router();

// create tenant (super-admin)
router.post('/', auth, role('super-admin'), async (req, res) => {
  const t = await Tenant.create(req.body);
  res.status(201).json(t);
});

// list tenants (super-admin)
router.get('/', auth, role('super-admin'), async (_, res) => {
  const all = await Tenant.find();
  res.json(all);
});

module.exports = router;
