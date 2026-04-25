const Tienda = require('../models/Tienda');

const DEFAULT_TIENDA = {
  tipo: 'tienda',
  nombre: 'Tienda',
  descripcion: '',
  categorias: {
    armas:        { label: '⚔️ Armas',        items: [] },
    equipamiento: { label: '🛡️ Equipamiento',  items: [] },
    comida:       { label: '🍖 Comida',        items: [] },
    variado:      { label: '🎒 Variado',       items: [] },
  }
};

async function getTienda() {
  let t = await Tienda.findOne({ tipo: 'tienda' });
  if (!t) t = await Tienda.create(DEFAULT_TIENDA);
  return t;
}

async function setInfo(nombre, descripcion) {
  await Tienda.findOneAndUpdate({ tipo: 'tienda' }, { nombre, descripcion });
}

async function addItem(categoria, item) {
  const t = await getTienda();
  t.categorias[categoria].items.push(item);
  await t.save();
  return t.categorias[categoria].items.at(-1)._id;
}

async function removeItem(categoria, itemId) {
  const t = await getTienda();
  t.categorias[categoria].items = t.categorias[categoria].items.filter(i => i._id.toString() !== itemId);
  await t.save();
  return true;
}

module.exports = { getTienda, setInfo, addItem, removeItem };
