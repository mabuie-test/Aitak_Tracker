const express = require('express');
const Device  = require('../models/Device');
const User    = require('../models/User');
const auth    = require('../middleware/authMiddleware');
const tenant  = require('../middleware/tenantMiddleware');
const role    = require('../middleware/roleMiddleware');
const router  = express.Router();

// todas as rotas requerem autenticação
router.use(auth);

// CREATE device (admin ou super-admin)
router.post(
  '/',
  role(['super-admin', 'admin']),
  async (req, res) => {
    try {
      const { imei, label, tenantId: bodyTenantId, owner } = req.body;
      const tenantId = req.user.role === 'super-admin'
        ? bodyTenantId
        : req.user.tenantId;
      if (req.user.role === 'super-admin' && !tenantId) {
        return res.status(400).json({ error: 'tenantId é obrigatório para super-admin' });
      }
      // valida owner
      let ownerId = null;
      if (owner) {
        const u = await User.findOne({ _id: owner, tenantId });
        if (!u) return res.status(400).json({ error: 'Owner inválido ou não pertence ao tenant' });
        ownerId = owner;
      }
      const d = await Device.create({ imei, label, tenantId, owner: ownerId });
      return res.status(201).json(await Device.findById(d._id).populate('owner', 'username'));
    } catch (err) {
      console.error('Erro a criar dispositivo:', err);
      return res.status(500).json({ error: 'Erro interno ao criar dispositivo' });
    }
  }
);

// LIST devices (admin e super-admin)
router.get(
  '/',
  role(['super-admin', 'admin']),
  tenant,
  async (req, res) => {
    const filter = req.user.role === 'super-admin'
      ? {}
      : { tenantId: req.user.tenantId };
    const list = await Device.find(filter).populate('owner', 'username');
    res.json(list);
  }
);

// GET one device
router.get(
  '/:id',
  role(['super-admin', 'admin']),
  tenant,
  async (req, res) => {
    const filter = req.user.role === 'super-admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, tenantId: req.user.tenantId };
    const d = await Device.findOne(filter).populate('owner', 'username');
    if (!d) return res.status(404).json({ error: 'Dispositivo não encontrado' });
    res.json(d);
  }
);

// UPDATE device (admin e super-admin)
router.put(
  '/:id',
  role(['super-admin', 'admin']),
  tenant,
  async (req, res) => {
    try {
      const { imei, label, status, geofence, owner, tenantId: bodyTenantId } = req.body;
      const filter = req.user.role === 'super-admin'
        ? { _id: req.params.id }
        : { _id: req.params.id, tenantId: req.user.tenantId };
      const update = {};
      if (imei) update.imei = imei;
      if (label) update.label = label;
      if (status) update.status = status;
      if (geofence) update.geofence = geofence;
      // ajustar tenantId para super-admin
      if (req.user.role === 'super-admin' && bodyTenantId) update.tenantId = bodyTenantId;
      // validar owner
      if (typeof owner !== 'undefined') {
        if (owner) {
          const u = await User.findOne({ _id: owner, tenantId: update.tenantId || req.user.tenantId });
          if (!u) return res.status(400).json({ error: 'Owner inválido ou não pertence ao tenant' });
          update.owner = owner;
        } else {
          update.owner = null;
        }
      }
      const d = await Device.findOneAndUpdate(filter, update, { new: true })
        .populate('owner', 'username');
      if (!d) return res.status(404).json({ error: 'Dispositivo não encontrado' });
      res.json(d);
    } catch (err) {
      console.error('Erro a atualizar dispositivo:', err);
      res.status(500).json({ error: 'Erro interno ao atualizar dispositivo' });
    }
  }
);

module.exports = router;
