const fs = require('fs');
const path = require('path');

const misionesFile = path.join(__dirname, '..', '..', 'data', 'misiones.json');

function ensureFile() {
  const dir = path.dirname(misionesFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(misionesFile)) fs.writeFileSync(misionesFile, JSON.stringify({}));
}

function getData() {
  ensureFile();
  return JSON.parse(fs.readFileSync(misionesFile, 'utf8'));
}

function saveData(data) {
  ensureFile();
  fs.writeFileSync(misionesFile, JSON.stringify(data, null, 2));
}

function getUserMisiones(userId) {
  const data = getData();
  if (!data[userId]) data[userId] = { activas: [], completadas: [] };
  return data[userId];
}

function agregarMision(userId, mision) {
  const data = getData();
  if (!data[userId]) data[userId] = { activas: [], completadas: [] };
  data[userId].activas.push({
    id: Date.now().toString(),
    nombre: mision.nombre,
    tier: mision.tier,
    descripcion: mision.descripcion || ''
  });
  saveData(data);
}

function completarMision(userId, misionId) {
  const data = getData();
  if (!data[userId]) return false;
  const idx = data[userId].activas.findIndex(m => m.id === misionId);
  if (idx === -1) return false;
  const [mision] = data[userId].activas.splice(idx, 1);
  mision.completadaEn = new Date().toISOString();
  data[userId].completadas.push(mision);
  saveData(data);
  return true;
}

function eliminarMision(userId, misionId) {
  const data = getData();
  if (!data[userId]) return false;
  data[userId].activas = data[userId].activas.filter(m => m.id !== misionId);
  saveData(data);
  return true;
}

module.exports = { getUserMisiones, agregarMision, completarMision, eliminarMision };
