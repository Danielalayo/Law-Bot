const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const tiendaManager = require('../managers/tiendaManager');

const CATS = ['armas', 'equipamiento', 'comida', 'variado'];

function buildEmbed(categoriaKey) {
  const tienda = tiendaManager.getTienda();
  const cat = tienda.categorias[categoriaKey];

  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle(`🏪 **${tienda.nombre}** — ${cat.label}`)
    .setDescription(tienda.descripcion ? `**${tienda.descripcion}**` : '**Bienvenido a la tienda.**');

  if (cat.items.length === 0) {
    embed.addFields({ name: '📦 Inventario', value: '**Sin items en esta categoría.**', inline: false });
  } else {
    for (const item of cat.items) {
      embed.addFields({
        name: `**${item.nombre}**`,
        value: `💰 **${item.precio} ryos**${item.descripcion ? `\n*${item.descripcion}*` : ''}`,
        inline: true
      });
    }
  }

  embed.setFooter({ text: 'Law Bot - Servidor de rol' });
  return embed;
}

function getRow(activa) {
  const tienda = tiendaManager.getTienda();
  return new ActionRowBuilder().addComponents(
    CATS.map(key =>
      new ButtonBuilder()
        .setCustomId(`tienda_cat_${key}`)
        .setLabel(tienda.categorias[key].label)
        .setStyle(key === activa ? ButtonStyle.Primary : ButtonStyle.Secondary)
    )
  );
}

module.exports = {
  name: 'tienda',
  async execute(message) {
    let catActiva = 'armas';

    const reply = await message.reply({
      embeds: [buildEmbed(catActiva)],
      components: [getRow(catActiva)]
    });

    const collector = reply.createMessageComponentCollector({ time: 120000 });

    collector.on('collect', async interaction => {
      catActiva = interaction.customId.replace('tienda_cat_', '');
      await interaction.update({ embeds: [buildEmbed(catActiva)], components: [getRow(catActiva)] });
    });

    collector.on('end', () => reply.edit({ components: [] }).catch(() => {}));
  }
};
