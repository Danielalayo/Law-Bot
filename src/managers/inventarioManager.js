const Inventario = require('../models/Inventario');

async function getInventario(userId) {
  return await Inventario.find({ userId });
}

async function addItem(userId, { nombre, cantidad = 1, descripcion = '' }) {
  return await Inventario.create({ userId, nombre, cantidad, descripcion });
}

async function addItemAdmin(userId, item) {
  return await addItem(userId, item);
}

async function removeItem(userId, itemId) {
  const r = await Inventario.deleteOne({ _id: itemId, userId });
  return r.deletedCount > 0;
}

module.exports = { getInventario, addItem, addItemAdmin, removeItem };
