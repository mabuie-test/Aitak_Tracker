// routes/deviceRoutes.js
const express = require('express');
const Device  = require('../models/Device');
const User    = require('../models/User');
const auth    = require('../middleware/authMiddleware');
const tenant  = require('../middleware/tenantMiddleware');
const role    = require('../middleware/roleMiddleware');
const router  = express.Router();

// Todas as rotas requerem autenticação
router.use(auth);

//
// CREATE device (admin ou super-admin)
//
router.post(
  '/',
  role(['super-admin', 'admin']),
  async (req, res) => {
    try {
      const { imei, label, tenantId: bodyTenantId, owner } = req.body;

      // Determina tenantId: se for super-admin, usa o que vem no body; senão, do token
      const tenantId = req.user.role === 'super-admin'
        ? bodyTenantId
        : req.user.tenantId;

      if (req.user.role === 'super-admin' && !tenantId) {
        return res.status(400).json({ error: 'tenantId é obrigatório para super-admin' });
      }

      // Valida owner, se fornecido
      let ownerId = null;
      if (owner) {
        const u = await User.findOne({ _id: owner, tenantId });
        if (!u) {
          return res.status(400).json({ error: 'Owner inválido ou não pertence ao tenant' });
        }
        ownerId = owner;
      }

      // Cria o dispositivo
      const d = await Device.create({ imei, label, tenantId, owner: ownerId });

      // Retorna o objeto populado com username do owner
      const populated = await Device.findById(d._id).populate('owner', 'username');
      return res.status(201).json(populated);
    } catch (err) {
      console.error('Erro a criar dispositivo:', err);
      return res.status(500).json({ error: 'Erro interno ao criar dispositivo' });
    }
  }
);

//
// LIST devices (qualquer utilizador autenticado)
//
router.get('/', tenant, async (req, res) => {
  try {
    const filter = req.user.role === 'super-admin'
      ? {}  // super-admin vê todos os dispositivos
      : { tenantId: req.user.tenantId };  // admin e user veem só do seu tenant

    const list = await Device.find(filter).populate('owner', 'username');
    return res.json(list);
  } catch (err) {
    console.error('Erro a listar dispositivos:', err);
    return res.status(500).json({ error: 'Erro interno ao listar dispositivos' });
  }
});

//
// GET one device (qualquer utilizador autenticado)
//
router.get('/:id', tenant, async (req, res) => {
  try {
    const filter = req.user.role === 'super-admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, tenantId: req.user.tenantId };

    const d = await Device.findOne(filter).populate('owner', 'username');
    if (!d) return res.status(404).json({ error: 'Dispositivo não encontrado' });
    return res.json(d);
  } catch (err) {
    console.error('Erro a obter dispositivo:', err);
    return res.status(500).json({ error: 'Erro interno ao obter dispositivo' });
  }
});

//
// UPDATE device (admin e super-admin)
//
router.put(
  '/:id',
  role(['super-admin', 'admin']),
  tenant,
  async (req, res) => {
    try {
      const {
        imei,
        label,
        status,
        geofence,
        owner,
        tenantId: bodyTenantId
      } = req.body;

      // Define filtro conforme papel
      const filter = req.user.role === 'super-admin'
        ? { _id: req.params.id }
        : { _id: req.params.id, tenantId: req.user.tenantId };

      // Constrói objeto de atualização dinamicamente
      const update = {};
      if (imei)    update.imei    = imei;
      if (label)   update.label   = label;
      if (status)  update.status  = status;
      if (geofence) update.geofence = geofence;
      if (req.user.role === 'super-admin' && bodyTenantId) {
        update.tenantId = bodyTenantId;
      }

      // Valida e define owner
      if (typeof owner !== 'undefined') {
        if (owner) {
          const validUser = await User.findOne({
            _id: owner,
            tenantId: update.tenantId || req.user.tenantId
          });
          if (!validUser) {
            return res.status(400).json({ error: 'Owner inválido ou não pertence ao tenant' });
          }
          update.owner = owner;
        } else {
          update.owner = null;
        }
      }

      // Executa a atualização
      const d = await Device.findOneAndUpdate(filter, update, { new: true })
        .populate('owner', 'username');

      if (!d) return res.status(404).json({ error: 'Dispositivo não encontrado' });
      return res.json(d);
    } catch (err) {
      console.error('Erro a atualizar dispositivo:', err);
      return res.status(500).json({ error: 'Erro interno ao atualizar dispositivo' });
    }
  }
);

module.exports = router;
