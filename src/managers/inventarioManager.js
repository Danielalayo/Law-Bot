const fs = require('fs');
const path = require('path');

const inventarioFile = path.join(__dirname, '..', '..', 'data', 'inventarios.json');

function ensureFile() {
  const dir = path.dirname(inventarioFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(inventarioFile)) fs.writeFileSync(inventarioFile, JSON.stringify({}));
}

function getData() {
  ensureFile();
  return JSON.parse(fs.readFileSync(inventarioFile, 'utf8'));
}

function saveData(data) {
  ensureFile();
  fs.writeFileSync(inventarioFile, JSON.stringify(data, null, 2));
}

function getInventario(userId) {
  const data = getData();
  if (!data[userId]) data[userId] = [];
  return data[userId];
}

function addItem(userId, item) {
  const data = getData();
  if (!data[userId]) data[userId] = [];
  const id = Date.now().toString();
  data[userId].push({ id, ...item, cantidad: item.cantidad || 1 });
  saveData(data);
  return id;
}

function removeItem(userId, itemId) {
  const data = getData();
  if (!data[userId]) return false;
  const antes = data[userId].length;
  data[userId] = data[userId].filter(i => i.id !== itemId);
  saveData(data);
  return data[userId].length < antes;
}

function addItemAdmin(userId, item) {
  return addItem(userId, item);
}

module.exports = { getInventario, addItem, removeItem, addItemAdmin };
