const { Schema, model } = require('mongoose');

const profileSchema = new Schema({
  userId:      { type: String, required: true, unique: true },
  username:    { type: String, default: '' },
  clan:        { type: String, default: null },
  doujutsu:    { type: String, default: null },
  doujutsuExp: { type: Number, default: 0 },
  kkg:         { type: String, default: null },
  elemento:    { type: String, default: null },
  bijuu:       { type: String, default: null },
  aldea:       { type: String, default: null },
  talento:     { type: String, default: null },
  rango:       { type: String, default: 'Genin' },
  dinero:      { type: Number, default: 0 },
  rrs:         { type: Number, default: 5 },
});

module.exports = model('Profile', profileSchema);
