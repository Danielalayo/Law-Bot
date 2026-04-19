const profileManager = require('../managers/profileManager');

module.exports = {
  name: 'agregardinero',
  async execute(message, args) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ **No tienes permisos para usar este comando.**');
    }

    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target || isNaN(amount) || amount <= 0) {
      return message.reply('❌ **Uso:** `+agregardinero @usuario <cantidad>`');
    }

    let profile = profileManager.getProfile(target.id);
    if (!profile) profile = profileManager.createProfile(target.id, target.username);

    const nuevoDinero = profileManager.addDinero(target.id, amount);
    message.reply(`✅ **Se agregaron ${amount} ryos** a ${target}. Total: **${nuevoDinero} ryos**.`);
  }
};
