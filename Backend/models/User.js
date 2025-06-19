const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role:         { type: String, enum: ['super-admin','admin','user'], default: 'user' },
  tenantId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null }
});
module.exports = mongoose.model('User', UserSchema);
