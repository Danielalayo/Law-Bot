const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
  nombre:      { type: String, required: true },
  precio:      { type: Number, default: 0 },
  descripcion: { type: String, default: '' },
});

const tiendaSchema = new Schema({
  tipo:        { type: String, required: true, unique: true }, // 'tienda' o 'mercado'
  nombre:      { type: String, default: 'Tienda' },
  descripcion: { type: String, default: '' },
  categorias: {
    armas:        { label: { type: String }, items: [itemSchema] },
    equipamiento: { label: { type: String }, items: [itemSchema] },
    comida:       { label: { type: String }, items: [itemSchema] },
    variado:      { label: { type: String }, items: [itemSchema] },
    implantes:    { label: { type: String }, items: [itemSchema] },
  }
});

module.exports = model('Tienda', tiendaSchema);
