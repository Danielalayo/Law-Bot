const Profile = require('../models/Profile');

async function getProfile(userId) {
  return await Profile.findOne({ userId });
}

async function createProfile(userId, username) {
  const existing = await Profile.findOne({ userId });
  if (existing) return existing;
  return await Profile.create({ userId, username });
}

async function updateProfile(userId, data) {
  return await Profile.findOneAndUpdate({ userId }, data, { new: true });
}

async function addRRs(userId, amount) {
  const p = await Profile.findOneAndUpdate({ userId }, { $inc: { rrs: amount } }, { new: true });
  return p?.rrs;
}

async function useRR(userId) {
  const p = await Profile.findOne({ userId });
  if (!p || p.rrs <= 0) return false;
  p.rrs -= 1;
  await p.save();
  return p.rrs;
}

async function addDinero(userId, amount) {
  const p = await Profile.findOneAndUpdate({ userId }, { $inc: { dinero: amount } }, { new: true });
  return p?.dinero;
}

module.exports = { getProfile, createProfile, updateProfile, addRRs, useRR, addDinero };
