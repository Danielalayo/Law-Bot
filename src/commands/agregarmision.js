const misionManager = require('../managers/misionManager');
const tiers = require('../config/misiones');

module.exports = {
  name: 'agregarmision',
  async execute(message, args) {
    if (!message.member.permissions.has('Administrator'))
      return message.reply('❌ **No tienes permisos para usar este comando.**');

    const target = message.mentions.users.first();
    const tier = args[1]?.toUpperCase();
    const nombre = args.slice(2).join(' ');

    if (!target || !tier || !nombre)
      return message.reply('❌ **Uso:** `+agregarmision @usuario <D/C/B/A/S> <nombre>`');
    if (!tiers[tier])
      return message.reply(`❌ **Tier inválido.** Usa: ${Object.keys(tiers).join(', ')}`);

    await misionManager.agregarMision(target.id, { nombre, tier });
    message.reply(`✅ **Misión "${nombre}"** de **Rango ${tier}** agregada a **${target.username}**.`);
  }
};
