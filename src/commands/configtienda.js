const {
  EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder,
  ModalBuilder, TextInputBuilder, TextInputStyle
} = require('discord.js');
const tiendaManager = require('../managers/tiendaManager');

const CATS = ['armas', 'equipamiento', 'comida', 'variado'];

function hasStaffPerms(member) {
  return member.permissions.has('Administrator') ||
         member.permissions.has('ModerateMembers') ||
         member.permissions.has('ManageGuild');
}

function buildResumenEmbed() {
  const tienda = tiendaManager.getTienda();
  const embed = new EmbedBuilder()
    .setColor(0xFFD700)
    .setTitle(`⚙️ **Config Tienda — ${tienda.nombre}**`)
    .setDescription(tienda.descripcion ? `**${tienda.descripcion}**` : '**Sin descripción**');

  for (const key of CATS) {
    const cat = tienda.categorias[key];
    const lista = cat.items.length === 0
      ? '*Vacía*'
      : cat.items.map(i => `• **${i.nombre}** — ${i.precio} ryos \`${i.id.slice(-4)}\``).join('\n');
    embed.addFields({ name: cat.label, value: lista, inline: false });
  }

  embed.setFooter({ text: 'Selecciona una acción' });
  return embed;
}

function menuAcciones() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_tienda_accion')
      .setPlaceholder('Selecciona una acción...')
      .addOptions([
        { label: '✏️ Editar nombre/descripción', value: 'editar_info' },
        { label: '➕ Agregar item',               value: 'agregar_item' },
        { label: '🗑️ Eliminar item',              value: 'eliminar_item' },
      ])
  );
}

module.exports = {
  name: 'configtienda',
  async execute(message) {
    if (!hasStaffPerms(message.member)) {
      return message.reply('❌ **No tienes permisos para usar este comando.**');
    }

    const reply = await message.reply({
      embeds: [buildResumenEmbed()],
      components: [menuAcciones()]
    });

    const collector = reply.createMessageComponentCollector({ time: 120000 });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: '❌ **Este menú no es tuyo.**', ephemeral: true });
      }

      if (interaction.customId === 'cfg_tienda_accion') {
        const accion = interaction.values[0];

        if (accion === 'editar_info') {
          const modal = new ModalBuilder()
            .setCustomId('modal_tienda_info')
            .setTitle('Editar Tienda')
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder().setCustomId('input_nombre').setLabel('Nombre').setStyle(TextInputStyle.Short).setRequired(true)
              ),
              new ActionRowBuilder().addComponents(
                new TextInputBuilder().setCustomId('input_desc').setLabel('Descripción').setStyle(TextInputStyle.Paragraph).setRequired(false)
              )
            );
          await interaction.showModal(modal);
          const submitted = await interaction.awaitModalSubmit({ time: 60000 }).catch(() => null);
          if (!submitted) return;
          tiendaManager.setInfo(
            submitted.fields.getTextInputValue('input_nombre'),
            submitted.fields.getTextInputValue('input_desc') || ''
          );
          await submitted.update({ embeds: [buildResumenEmbed()], components: [menuAcciones()] });
        }

        else if (accion === 'agregar_item') {
          // Primero elegir categoría
          const rowCat = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('cfg_tienda_cat_agregar')
              .setPlaceholder('Selecciona la categoría...')
              .addOptions(CATS.map(k => ({ label: tiendaManager.getTienda().categorias[k].label, value: k })))
          );
          await interaction.update({ embeds: [buildResumenEmbed()], components: [rowCat] });
        }

        else if (accion === 'eliminar_item') {
          const rowCat = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId('cfg_tienda_cat_eliminar')
              .setPlaceholder('Selecciona la categoría...')
              .addOptions(CATS.map(k => ({ label: tiendaManager.getTienda().categorias[k].label, value: k })))
          );
          await interaction.update({ embeds: [buildResumenEmbed()], components: [rowCat] });
        }
      }

      // Categoría seleccionada para agregar
      else if (interaction.customId === 'cfg_tienda_cat_agregar') {
        const cat = interaction.values[0];
        const modal = new ModalBuilder()
          .setCustomId(`modal_agregar_${cat}`)
          .setTitle('Agregar Item')
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder().setCustomId('item_nombre').setLabel('Nombre').setStyle(TextInputStyle.Short).setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder().setCustomId('item_precio').setLabel('Precio (ryos)').setStyle(TextInputStyle.Short).setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder().setCustomId('item_desc').setLabel('Descripción').setStyle(TextInputStyle.Paragraph).setRequired(false)
            )
          );
        await interaction.showModal(modal);
        const submitted = await interaction.awaitModalSubmit({ time: 60000 }).catch(() => null);
        if (!submitted) return;
        tiendaManager.addItem(cat, {
          nombre: submitted.fields.getTextInputValue('item_nombre'),
          precio: parseInt(submitted.fields.getTextInputValue('item_precio')) || 0,
          descripcion: submitted.fields.getTextInputValue('item_desc') || ''
        });
        await submitted.update({ embeds: [buildResumenEmbed()], components: [menuAcciones()] });
      }

      // Categoría seleccionada para eliminar
      else if (interaction.customId === 'cfg_tienda_cat_eliminar') {
        const cat = interaction.values[0];
        const items = tiendaManager.getTienda().categorias[cat].items;
        if (items.length === 0) {
          return interaction.reply({ content: '❌ **Esta categoría está vacía.**', ephemeral: true });
        }
        const rowItems = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`cfg_tienda_del_${cat}`)
            .setPlaceholder('Selecciona el item a eliminar...')
            .addOptions(items.map(i => ({ label: i.nombre, value: i.id, description: `${i.precio} ryos` })))
        );
        await interaction.update({ embeds: [buildResumenEmbed()], components: [rowItems] });
      }

      // Eliminar item
      else if (interaction.customId.startsWith('cfg_tienda_del_')) {
        const cat = interaction.customId.replace('cfg_tienda_del_', '');
        tiendaManager.removeItem(cat, interaction.values[0]);
        await interaction.update({ embeds: [buildResumenEmbed()], components: [menuAcciones()] });
      }
    });

    collector.on('end', () => reply.edit({ components: [] }).catch(() => {}));
  }
};
