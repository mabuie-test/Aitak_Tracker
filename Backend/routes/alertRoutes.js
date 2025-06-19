const express = require('express');
const Alert   = require('../models/Alert');
const Device  = require('../models/Device');
const auth    = require('../middleware/authMiddleware');
const tenant  = require('../middleware/tenantMiddleware');
const router  = express.Router();

// public for geofence alerts
router.get('/', async (req, res) => {
  const { imei, code } = req.query;
  const d = await Device.findOne({ imei });
  if (!d) return res.status(404).json({ error: 'Dispositivo não encontrado' });
  await Alert.create({ tenantId: d.tenantId, device: d._id, type: code });
  d.status = (code === 'GEOFENCE_OUT') ? 'blocked' : 'active';
  await d.save();
  res.sendStatus(200);
});

// protected history
router.get('/history', auth, tenant, async (req, res) => {
  const a = await Alert.find({ tenantId: req.tenantId })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(a);
});

module.exports = router;
