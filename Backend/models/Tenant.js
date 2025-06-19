const mongoose = require('mongoose');
const TenantSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  contactEmail: { type: String, required: true },
  plan:         { type: String, enum: ['free','basic','premium'], default: 'basic' },
  createdAt:    { type: Date, default: Date.now }
});
module.exports = mongoose.model('Tenant', TenantSchema);
