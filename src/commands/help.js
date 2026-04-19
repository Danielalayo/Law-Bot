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
            '`+inventario` — **Ver tu inventario**',
            '`+inventario @usuario` — **Ver el inventario de otro usuario**',
          ].join('\n'),
          inline: false
        },
        {
          name: '💰 **Economía**',
          value: [
            '`+balance` — **Ver tu dinero**',
            '`+balance @usuario` — **Ver el dinero de otro usuario**',
            '`+pay @usuario <cantidad>` — **Enviar dinero a otro usuario**',
          ].join('\n'),
          inline: false
        },
        {
          name: '🏪 **Tienda**',
          value: [
            '`+tienda` — **Ver la tienda (Armas / Equipamiento / Comida / Variado)**',
          ].join('\n'),
          inline: false
        },
        {
          name: '🖤 **Mercado Negro**',
          value: [
            '`+mercadonegro` — **Ver el mercado negro (Armas / Equipamiento / Implantes)**',
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
            '`+config @usuario` — **Configurar el perfil de un usuario**',
            '`+configtienda` — **Gestionar la tienda**',
            '`+configmercado` — **Gestionar el mercado negro**',
            '`+agregardinero @usuario <cantidad>` — **Agregar dinero a un usuario**',
            '`+darobjeto @usuario <nombre> [cantidad]` — **Dar un objeto a un usuario**',
            '`+quitarobjeto @usuario` — **Quitar un objeto del inventario**',
            '`+agregarmision @usuario <D/C/B/A/S> <nombre>` — **Asignar misión a un usuario**',
            '`+completarmision @usuario <id>` — **Marcar misión como completada**',
            '`+initperfiles` — **Crear perfiles a todos los usuarios del servidor**',
          ].join('\n'),
          inline: false
        }
      )
      .setFooter({ text: 'Law Bot - Servidor de rol' });

    message.reply({ embeds: [embed] });
  }
};
