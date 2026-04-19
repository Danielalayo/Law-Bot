const profileManager = require('../managers/profileManager');

module.exports = {
  name: 'initperfiles',
  async execute(message) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ **No tienes permisos para usar este comando.**');
    }

    await message.guild.members.fetch();
    const members = message.guild.members.cache.filter(m => !m.user.bot);

    let creados = 0;
    let existentes = 0;

    for (const [, member] of members) {
      const existe = profileManager.getProfile(member.user.id);
      if (!existe) {
        profileManager.createProfile(member.user.id, member.user.username);
        creados++;
      } else {
        existentes++;
      }
    }

    message.reply(
      `✅ **Perfiles inicializados.**\n` +
      `📄 Creados: **${creados}**\n` +
      `⏭️ Ya existían: **${existentes}**`
    );
  }
};
