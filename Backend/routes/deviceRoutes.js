const express = require('express');
const Device  = require('../models/Device');
const auth    = require('../middleware/authMiddleware');
const tenant  = require('../middleware/tenantMiddleware');
const role    = require('../middleware/roleMiddleware');
const router  = express.Router();

// all routes require auth+tenant
router.use(auth, tenant);

// create device (admin)
router.post('/', role('admin'), async (req, res) => {
  const d = await Device.create({ ...req.body, tenantId: req.tenantId });
  res.status(201).json(d);
});

// list devices
router.get('/', async (req, res) => {
  const list = await Device.find({ tenantId: req.tenantId });
  res.json(list);
});

// get one device
router.get('/:id', async (req, res) => {
  const d = await Device.findOne({ _id: req.params.id, tenantId: req.tenantId });
  if (!d) return res.status(404).json({ error: 'Não encontrado' });
  res.json(d);
});

// update device
router.put('/:id', role('admin'), async (req, res) => {
  const d = await Device.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.tenantId },
    req.body,
    { new: true }
  );
  if (!d) return res.status(404).json({ error: 'Não encontrado' });
  res.json(d);
});

module.exports = router;
