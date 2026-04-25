const { Schema, model } = require('mongoose');

const inventarioSchema = new Schema({
  userId:      { type: String, required: true },
  nombre:      { type: String, required: true },
  cantidad:    { type: Number, default: 1 },
  descripcion: { type: String, default: '' },
}, { timestamps: true });

module.exports = model('Inventario', inventarioSchema);
