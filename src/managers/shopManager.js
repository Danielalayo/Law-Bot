const fs = require('fs');
const path = require('path');

const shopsFile = path.join(__dirname, '..', '..', 'data', 'shops.json');

function ensureShopsFile() {
  const dir = path.dirname(shopsFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(shopsFile)) {
    fs.writeFileSync(shopsFile, JSON.stringify({}));
  }
}

function getShops() {
  ensureShopsFile();
  return JSON.parse(fs.readFileSync(shopsFile, 'utf8'));
}

function saveShops(shops) {
  ensureShopsFile();
  fs.writeFileSync(shopsFile, JSON.stringify(shops, null, 2));
}

function createShop(guildId, shopName, description = '') {
  const shops = getShops();
  if (!shops[guildId]) shops[guildId] = {};
  shops[guildId][shopName] = {
    name: shopName,
    description,
    items: [],
    createdAt: new Date().toISOString()
  };
  saveShops(shops);
  return shops[guildId][shopName];
}

function getShop(guildId, shopName) {
  const shops = getShops();
  return shops[guildId]?.[shopName];
}

function getGuildShops(guildId) {
  const shops = getShops();
  return shops[guildId] || {};
}

function deleteShop(guildId, shopName) {
  const shops = getShops();
  if (shops[guildId]) {
    delete shops[guildId][shopName];
    saveShops(shops);
    return true;
  }
  return false;
}

function addItem(guildId, shopName, item) {
  const shops = getShops();
  if (shops[guildId]?.[shopName]) {
    const itemId = Date.now().toString();
    shops[guildId][shopName].items.push({ id: itemId, ...item });
    saveShops(shops);
    return itemId;
  }
  return null;
}

function removeItem(guildId, shopName, itemId) {
  const shops = getShops();
  if (shops[guildId]?.[shopName]) {
    shops[guildId][shopName].items = shops[guildId][shopName].items.filter(i => i.id !== itemId);
    saveShops(shops);
    return true;
  }
  return false;
}

function getItems(guildId, shopName) {
  const shop = getShop(guildId, shopName);
  return shop ? shop.items : [];
}

module.exports = { createShop, getShop, getGuildShops, deleteShop, addItem, removeItem, getItems };
