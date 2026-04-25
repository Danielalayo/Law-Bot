const inventarioManager = require('../managers/inventarioManager');

function hasStaffPerms(member) {
  return member.permissions.has('Administrator') ||
         member.permissions.has('ModerateMembers') ||
         member.permissions.has('ManageGuild');
}

module.exports = {
  name: 'darobjeto',
  async execute(message, args) {
    if (!hasStaffPerms(message.member))
      return message.reply('❌ **No tienes permisos para usar este comando.**');

    const target = message.mentions.users.first();
    const cleanArgs = args.filter(a => !a.startsWith('<@'));
    const cantidad = parseInt(cleanArgs[cleanArgs.length - 1]);
    const nombre = cantidad ? cleanArgs.slice(0, -1).join(' ') : cleanArgs.join(' ');
    const cantidadFinal = cantidad || 1;

    if (!target || !nombre)
      return message.reply('❌ **Uso:** `+darobjeto @usuario <nombre> [cantidad]`');

    await inventarioManager.addItemAdmin(target.id, { nombre, cantidad: cantidadFinal });
    message.reply(`✅ **${cantidadFinal}x ${nombre}** agregado al inventario de **${target.username}**.`);
  }
};
