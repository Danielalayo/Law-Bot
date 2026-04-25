const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const inventarioManager = require('../managers/inventarioManager');

function hasStaffPerms(member) {
  return member.permissions.has('Administrator') ||
         member.permissions.has('ModerateMembers') ||
         member.permissions.has('ManageGuild');
}

module.exports = {
  name: 'quitarobjeto',
  async execute(message, args) {
    if (!hasStaffPerms(message.member))
      return message.reply('❌ **No tienes permisos para usar este comando.**');

    const target = message.mentions.users.first();
    if (!target) return message.reply('❌ **Uso:** `+quitarobjeto @usuario`');

    const items = await inventarioManager.getInventario(target.id);
    if (items.length === 0)
      return message.reply(`❌ **${target.username} no tiene items en su inventario.**`);

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('quitar_item_select')
        .setPlaceholder('Selecciona el item a quitar...')
        .addOptions(items.map(i => ({ label: `${i.nombre} x${i.cantidad}`, value: i._id.toString() })))
    );

    const reply = await message.reply({ content: `**Selecciona el item a quitar de ${target.username}:**`, components: [row] });

    const collector = reply.createMessageComponentCollector({ time: 30000 });
    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id)
        return interaction.reply({ content: '❌ **Este menú no es tuyo.**', ephemeral: true });
      await inventarioManager.removeItem(target.id, interaction.values[0]);
      await interaction.update({ content: `✅ **Item eliminado del inventario de ${target.username}.**`, components: [] });
      collector.stop();
    });

    collector.on('end', () => reply.edit({ components: [] }).catch(() => {}));
  }
};
