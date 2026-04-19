const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const mercadoManager = require('../managers/mercadoManager');

const CATS = ['armas', 'equipamiento', 'implantes'];

function buildEmbed(categoriaKey) {
  const mercado = mercadoManager.getMercado();
  const cat = mercado.categorias[categoriaKey];

  const embed = new EmbedBuilder()
    .setColor(0x2C2C2C)
    .setTitle(`🖤 **${mercado.nombre}** — ${cat.label}`)
    .setDescription(mercado.descripcion ? `**${mercado.descripcion}**` : '**Bienvenido al Mercado Negro.**');

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
  const mercado = mercadoManager.getMercado();
  return new ActionRowBuilder().addComponents(
    CATS.map(key =>
      new ButtonBuilder()
        .setCustomId(`mercado_cat_${key}`)
        .setLabel(mercado.categorias[key].label)
        .setStyle(key === activa ? ButtonStyle.Danger : ButtonStyle.Secondary)
    )
  );
}

module.exports = {
  name: 'mercadonegro',
  async execute(message) {
    let catActiva = 'armas';

    const reply = await message.reply({
      embeds: [buildEmbed(catActiva)],
      components: [getRow(catActiva)]
    });

    const collector = reply.createMessageComponentCollector({ time: 120000 });

    collector.on('collect', async interaction => {
      catActiva = interaction.customId.replace('mercado_cat_', '');
      await interaction.update({ embeds: [buildEmbed(catActiva)], components: [getRow(catActiva)] });
    });

    collector.on('end', () => reply.edit({ components: [] }).catch(() => {}));
  }
};
