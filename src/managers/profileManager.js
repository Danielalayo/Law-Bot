const fs = require('fs');
const path = require('path');

const profilesFile = path.join(__dirname, '..', '..', 'data', 'profiles.json');

function ensureFile() {
  const dir = path.dirname(profilesFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(profilesFile)) fs.writeFileSync(profilesFile, JSON.stringify({}));
}

function getProfiles() {
  ensureFile();
  return JSON.parse(fs.readFileSync(profilesFile, 'utf8'));
}

function saveProfiles(profiles) {
  ensureFile();
  fs.writeFileSync(profilesFile, JSON.stringify(profiles, null, 2));
}

function getProfile(userId) {
  const profiles = getProfiles();
  return profiles[userId] || null;
}

function createProfile(userId, username) {
  const profiles = getProfiles();
  if (profiles[userId]) return profiles[userId];
  profiles[userId] = {
    username,
    clan: null,
    doujutsu: null,
    doujutsuExp: 0,
    kkg: null,
    elemento: null,
    bijuu: null,
    aldea: null,
    talento: null,
    rango: 'Genin',
    dinero: 0,
    rrs: 5
  };
  saveProfiles(profiles);
  return profiles[userId];
}

function updateProfile(userId, data) {
  const profiles = getProfiles();
  if (!profiles[userId]) return null;
  profiles[userId] = { ...profiles[userId], ...data };
  saveProfiles(profiles);
  return profiles[userId];
}

function addRRs(userId, amount) {
  const profiles = getProfiles();
  if (!profiles[userId]) return null;
  profiles[userId].rrs += amount;
  saveProfiles(profiles);
  return profiles[userId].rrs;
}

function useRR(userId) {
  const profiles = getProfiles();
  if (!profiles[userId]) return null;
  if (profiles[userId].rrs <= 0) return false;
  profiles[userId].rrs -= 1;
  saveProfiles(profiles);
  return profiles[userId].rrs;
}

function addDinero(userId, amount) {
  const profiles = getProfiles();
  if (!profiles[userId]) return null;
  profiles[userId].dinero = (profiles[userId].dinero || 0) + amount;
  saveProfiles(profiles);
  return profiles[userId].dinero;
}

module.exports = { getProfile, createProfile, updateProfile, addRRs, useRR, addDinero };
