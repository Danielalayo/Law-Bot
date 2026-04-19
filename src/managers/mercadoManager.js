const fs = require('fs');
const path = require('path');

const mercadoFile = path.join(__dirname, '..', '..', 'data', 'mercado.json');

const defaultData = {
  nombre: 'Mercado Negro',
  descripcion: '',
  categorias: {
    armas:       { label: '⚔️ Armas',       items: [] },
    equipamiento: { label: '🛡️ Equipamiento', items: [] },
    implantes:   { label: '🦾 Implantes',    items: [] },
  }
};

function ensureFile() {
  const dir = path.dirname(mercadoFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(mercadoFile)) fs.writeFileSync(mercadoFile, JSON.stringify(defaultData, null, 2));
}

function getMercado() {
  ensureFile();
  return JSON.parse(fs.readFileSync(mercadoFile, 'utf8'));
}

function saveMercado(data) {
  ensureFile();
  fs.writeFileSync(mercadoFile, JSON.stringify(data, null, 2));
}

function setInfo(nombre, descripcion) {
  const mercado = getMercado();
  mercado.nombre = nombre;
  mercado.descripcion = descripcion;
  saveMercado(mercado);
}

function addItem(categoria, item) {
  const mercado = getMercado();
  if (!mercado.categorias[categoria]) return false;
  const id = Date.now().toString();
  mercado.categorias[categoria].items.push({ id, ...item });
  saveMercado(mercado);
  return id;
}

function removeItem(categoria, id) {
  const mercado = getMercado();
  if (!mercado.categorias[categoria]) return false;
  const antes = mercado.categorias[categoria].items.length;
  mercado.categorias[categoria].items = mercado.categorias[categoria].items.filter(i => i.id !== id);
  saveMercado(mercado);
  return mercado.categorias[categoria].items.length < antes;
}

module.exports = { getMercado, setInfo, addItem, removeItem };
