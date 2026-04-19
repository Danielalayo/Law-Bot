const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  async execute(message) {
    const embed = new EmbedBuilder()
      .setColor(0xFF0000)
      .setTitle('🏴‍☠️ **Law Bot - Comandos**')
      .addFields(
        {
          name: '👤 **Perfil**',
          value: [
            '`+perfil` — **Ver tu perfil**',
            '`+perfil @usuario` — **Ver el perfil de otro usuario**',
          ].join('\n'),
          inline: false
        },
        {
          name: '💰 **Economía**',
          value: [
            '`+balance` — **Ver tu dinero**',
            '`+pay @usuario <cantidad>` — **Enviar dinero a otro usuario**',
          ].join('\n'),
          inline: false
        },
        {
          name: '📋 **Misiones**',
          value: [
            '`+tablamision` — **Ver tabla de misiones y solicitar una**',
          ].join('\n'),
          inline: false
        },
        {
          name: '🛡️ **Admin**',
          value: [
            '`+agregardinero @usuario <cantidad>` — **Agregar dinero a un usuario**',
            '`+agregarmision @usuario <D/C/B/A/S> <nombre>` — **Asignar misión a un usuario**',
            '`+completarmision @usuario <id>` — **Marcar misión como completada**',
          ].join('\n'),
          inline: false
        }
      )
      .setFooter({ text: 'Law Bot - Servidor de rol' });

    message.reply({ embeds: [embed] });
  }
};
