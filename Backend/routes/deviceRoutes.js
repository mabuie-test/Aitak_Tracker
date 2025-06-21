const express = require('express');
const Device  = require('../models/Device');
const auth    = require('../middleware/authMiddleware');
const tenant  = require('../middleware/tenantMiddleware');
const role    = require('../middleware/roleMiddleware');
const router  = express.Router();

// todas as rotas requerem autenticação
router.use(auth);

// create device (admin ou super-admin)
router.post(
  '/',
  // permite super-admin e admin
  role(['super-admin', 'admin']),
  async (req, res) => {
    try {
      // se for super-admin, usa tenantId vindo no body; senão, usa o tenant do token
      const tenantId = req.user.role === 'super-admin'
        ? req.body.tenantId
        : req.user.tenantId;

      if (!tenantId) {
        return res.status(400).json({ error: 'tenantId é obrigatório para super-admin' });
      }

      const d = await Device.create({ 
        imei: req.body.imei,
        label: req.body.label,
        tenantId 
      });

      return res.status(201).json(d);
    } catch (err) {
      console.error('Erro a criar dispositivo:', err);
      return res.status(500).json({ error: 'Erro interno ao criar dispositivo' });
    }
  }
);

// lista dispositivos (admin e super-admin)
router.get(
  '/',
  role(['super-admin', 'admin']),
  tenant,
  async (req, res) => {
    const filter = req.user.role === 'super-admin'
      ? {}                // super-admin vê todos os tenants
      : { tenantId: req.user.tenantId };

    const list = await Device.find(filter);
    res.json(list);
  }
);

// obter um dispositivo
router.get(
  '/:id',
  role(['super-admin', 'admin']),
  tenant,
  async (req, res) => {
    const filter = req.user.role === 'super-admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, tenantId: req.user.tenantId };

    const d = await Device.findOne(filter);
    if (!d) return res.status(404).json({ error: 'Dispositivo não encontrado' });
    res.json(d);
  }
);

// update device (admin e super-admin)
router.put(
  '/:id',
  role(['super-admin', 'admin']),
  tenant,
  async (req, res) => {
    try {
      const filter = req.user.role === 'super-admin'
        ? { _id: req.params.id }
        : { _id: req.params.id, tenantId: req.user.tenantId };

      const update = {
        ...(req.body.imei   && { imei: req.body.imei }),
        ...(req.body.label  && { label: req.body.label }),
        ...(req.body.status && { status: req.body.status }),
        ...(req.body.geofence && { geofence: req.body.geofence })
      };

      const d = await Device.findOneAndUpdate(filter, update, { new: true });
      if (!d) return res.status(404).json({ error: 'Dispositivo não encontrado' });
      res.json(d);
    } catch (err) {
      console.error('Erro a atualizar dispositivo:', err);
      res.status(500).json({ error: 'Erro interno ao atualizar dispositivo' });
    }
  }
);

module.exports = router;
