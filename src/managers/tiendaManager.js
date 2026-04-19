const fs = require('fs');
const path = require('path');

const tiendaFile = path.join(__dirname, '..', '..', 'data', 'tienda.json');

const defaultData = {
  nombre: 'Tienda',
  descripcion: '',
  categorias: {
    armas:       { label: ' Armas',       items: [] },
    equipamiento: { label: ' Equipamiento', items: [] },
    comida:      { label: ' Comida',       items: [] },
    variado:     { label: ' Variado',      items: [] },
  }
};

function ensureFile() {
  const dir = path.dirname(tiendaFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(tiendaFile)) fs.writeFileSync(tiendaFile, JSON.stringify(defaultData, null, 2));
}

function getTienda() {
  ensureFile();
  return JSON.parse(fs.readFileSync(tiendaFile, 'utf8'));
}

function saveTienda(data) {
  ensureFile();
  fs.writeFileSync(tiendaFile, JSON.stringify(data, null, 2));
}

function setInfo(nombre, descripcion) {
  const tienda = getTienda();
  tienda.nombre = nombre;
  tienda.descripcion = descripcion;
  saveTienda(tienda);
}

function addItem(categoria, item) {
  const tienda = getTienda();
  if (!tienda.categorias[categoria]) return false;
  const id = Date.now().toString();
  tienda.categorias[categoria].items.push({ id, ...item });
  saveTienda(tienda);
  return id;
}

function removeItem(categoria, id) {
  const tienda = getTienda();
  if (!tienda.categorias[categoria]) return false;
  const antes = tienda.categorias[categoria].items.length;
  tienda.categorias[categoria].items = tienda.categorias[categoria].items.filter(i => i.id !== id);
  saveTienda(tienda);
  return tienda.categorias[categoria].items.length < antes;
}

module.exports = { getTienda, setInfo, addItem, removeItem };
