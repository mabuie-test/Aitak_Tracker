// models/Device.js
const mongoose = require('mongoose');
const DeviceSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  imei:     { type: String, required: true, unique: true },
  label:    { type: String },
  status:   { type: String, enum: ['active','blocked'], default: 'active' },
  geofence: {
    center: { lat: Number, lng: Number },
    radius: Number
  },
  owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});
module.exports = mongoose.model('Device', DeviceSchema);
