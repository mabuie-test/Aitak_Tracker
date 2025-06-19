const express = require('express');
const Track   = require('../models/Track');
const Device  = require('../models/Device');
const auth    = require('../middleware/authMiddleware');
const tenant  = require('../middleware/tenantMiddleware');
const router  = express.Router();

// public endpoint for device to send position
router.get('/', async (req, res) => {
  const { imei, lat, lng } = req.query;
  const d = await Device.findOne({ imei });
  if (!d) return res.status(404).json({ error: 'Dispositivo não encontrado' });
  const t = await Track.create({
    tenantId: d.tenantId,
    device: d._id,
    latitude: parseFloat(lat),
    longitude: parseFloat(lng)
  });
  res.status(201).json(t);
});

// protected history
router.get('/history', auth, tenant, async (req, res) => {
  const h = await Track.find({ tenantId: req.tenantId })
    .sort({ timestamp: -1 })
    .limit(100);
  res.json(h);
});

module.exports = router;
