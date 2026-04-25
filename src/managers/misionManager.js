const Mision = require('../models/Mision');

async function getUserMisiones(userId) {
  const activas     = await Mision.find({ userId, completada: false });
  const completadas = await Mision.find({ userId, completada: true });
  return { activas, completadas };
}

async function agregarMision(userId, { nombre, tier, descripcion = '' }) {
  return await Mision.create({ userId, nombre, tier, descripcion });
}

async function completarMision(userId, misionId) {
  const m = await Mision.findOneAndUpdate(
    { _id: misionId, userId, completada: false },
    { completada: true, completadaEn: new Date() },
    { new: true }
  );
  return !!m;
}

async function eliminarMision(userId, misionId) {
  const r = await Mision.deleteOne({ _id: misionId, userId });
  return r.deletedCount > 0;
}

module.exports = { getUserMisiones, agregarMision, completarMision, eliminarMision };
