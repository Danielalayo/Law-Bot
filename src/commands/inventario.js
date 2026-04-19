const { EmbedBuilder } = require('discord.js');
const inventarioManager = require('../managers/inventarioManager');

module.exports = {
  name: 'inventario',
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const items = inventarioManager.getInventario(target.id);

    const embed = new EmbedBuilder()
      .setColor(0x8B4513)
      .setTitle(` **Inventario de ${target.username}**`)
      .setThumbnail(target.displayAvatarURL());

    if (items.length === 0) {
      embed.setDescription('**El inventario está vacío.**');
    } else {
      const lista = items.map(i =>
        `• **${i.nombre}** x${i.cantidad}${i.descripcion ? ` — *${i.descripcion}*` : ''}`
      ).join('\n');
      embed.setDescription(lista);
    }

    embed.setFooter({ text: 'Law Bot - Servidor de rol' });
    message.reply({ embeds: [embed] });
  }
};
