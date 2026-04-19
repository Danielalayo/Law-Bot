const inventarioManager = require('../managers/inventarioManager');

function hasStaffPerms(member) {
  return member.permissions.has('Administrator') ||
         member.permissions.has('ModerateMembers') ||
         member.permissions.has('ManageGuild');
}

module.exports = {
  name: 'darobjeto',
  async execute(message, args) {
    if (!hasStaffPerms(message.member)) {
      return message.reply('❌ **No tienes permisos para usar este comando.**');
    }

    // +darobjeto @usuario <nombre> [cantidad]
    const target = message.mentions.users.first();
    const nombre = args[1];
    const cantidad = parseInt(args[2]) || 1;

    if (!target || !nombre) {
      return message.reply('❌ **Uso:** `+darobjeto @usuario <nombre> [cantidad]`');
    }

    inventarioManager.addItemAdmin(target.id, { nombre, cantidad });
    message.reply(`✅ **${cantidad}x ${nombre}** agregado al inventario de ${target}.`);
  }
};
