const mongoose = require('mongoose');
const AlertSchema = new mongoose.Schema({
  tenantId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  device:    { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  type:      { type: String, enum: ['GEOFENCE_OUT','GEOFENCE_IN'] },
  data:      mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Alert', AlertSchema);
