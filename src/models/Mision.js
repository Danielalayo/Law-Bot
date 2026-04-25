const { Schema, model } = require('mongoose');

const misionSchema = new Schema({
  userId:      { type: String, required: true },
  nombre:      { type: String, required: true },
  tier:        { type: String, required: true },
  descripcion: { type: String, default: '' },
  completada:  { type: Boolean, default: false },
  completadaEn:{ type: Date, default: null },
}, { timestamps: true });

module.exports = model('Mision', misionSchema);
