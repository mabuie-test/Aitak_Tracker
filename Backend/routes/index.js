const express      = require('express');
const authRoutes   = require('./authRoutes');
const tenantRoutes = require('./tenantRoutes');
const userRoutes   = require('./userRoutes');
const deviceRoutes = require('./deviceRoutes');
const trackRoutes  = require('./trackRoutes');
const alertRoutes  = require('./alertRoutes');

const router = express.Router();
router.use('/auth',   authRoutes);
router.use('/tenants',tenantRoutes);
router.use('/users',  userRoutes);
router.use('/devices',deviceRoutes);
router.use('/track',  trackRoutes);
router.use('/alert',  alertRoutes);

module.exports = router;
