const Tienda = require('../models/Tienda');

const DEFAULT_MERCADO = {
  tipo: 'mercado',
  nombre: 'Mercado Negro',
  descripcion: '',
  categorias: {
    armas:        { label: '⚔️ Armas',        items: [] },
    equipamiento: { label: '🛡️ Equipamiento',  items: [] },
    implantes:    { label: '🦾 Implantes',     items: [] },
  }
};

async function getMercado() {
  let m = await Tienda.findOne({ tipo: 'mercado' });
  if (!m) m = await Tienda.create(DEFAULT_MERCADO);
  return m;
}

async function setInfo(nombre, descripcion) {
  await Tienda.findOneAndUpdate({ tipo: 'mercado' }, { nombre, descripcion });
}

async function addItem(categoria, item) {
  const m = await getMercado();
  m.categorias[categoria].items.push(item);
  await m.save();
  return m.categorias[categoria].items.at(-1)._id;
}

async function removeItem(categoria, itemId) {
  const m = await getMercado();
  m.categorias[categoria].items = m.categorias[categoria].items.filter(i => i._id.toString() !== itemId);
  await m.save();
  return true;
}

module.exports = { getMercado, setInfo, addItem, removeItem };
