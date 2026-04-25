const { EmbedBuilder } = require('discord.js');
const profileManager = require('../managers/profileManager');

module.exports = {
  name: 'balance',
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    let profile = await profileManager.getProfile(target.id);
    if (!profile) profile = await profileManager.createProfile(target.id, target.username);

    const embed = new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle(`💰 **Balance de ${target.username}**`)
      .addFields({ name: '💴 Ryos', value: `**${profile.dinero || 0} ryos**`, inline: true })
      .setFooter({ text: 'Law Bot - Servidor de rol' });

    message.reply({ embeds: [embed] });
  }
};
