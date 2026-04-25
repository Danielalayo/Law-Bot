const profileManager = require('../managers/profileManager');
const misionManager = require('../managers/misionManager');
const ascensos = require('../config/ascensos');

const RANGOS = ['Genin', 'Chunin', 'Jonin', 'ANBU', 'Kage'];

function verificarAscenso(profile, completadas) {
  const rangoActual = profile.rango || 'Genin';
  const ascenso = ascensos[rangoActual];
  if (!ascenso) return null;

  const conteo = {};
  for (const m of completadas) conteo[m.tier] = (conteo[m.tier] || 0) + 1;

  for (const [tier, cantidad] of Object.entries(ascenso.requisitos)) {
    if ((conteo[tier] || 0) < cantidad) return null;
  }
  return ascenso.siguiente;
}

module.exports = {
  name: 'completarmision',
  async execute(message, args) {
    if (!message.member.permissions.has('Administrator'))
      return message.reply('❌ **No tienes permisos para usar este comando.**');

    const target = message.mentions.users.first();
    const misionId = args[1];

    if (!target || !misionId)
      return message.reply('❌ **Uso:** `+completarmision @usuario <id_mision>`');

    const ok = await misionManager.completarMision(target.id, misionId);
    if (!ok) return message.reply('❌ **No se encontró la misión activa con ese ID.**');

    const profile = await profileManager.getProfile(target.id);
    const { completadas } = await misionManager.getUserMisiones(target.id);
    const nuevoRango = verificarAscenso(profile, completadas);

    if (nuevoRango) {
      await profileManager.updateProfile(target.id, { rango: nuevoRango });
      return message.reply(`✅ **Misión completada** para **${target.username}**.\n🎉 **¡${target.username} ha ascendido a ${nuevoRango}!**`);
    }

    const rangoActual = profile.rango || 'Genin';
    const ascenso = ascensos[rangoActual];
    if (ascenso) {
      const conteo = {};
      for (const m of completadas) conteo[m.tier] = (conteo[m.tier] || 0) + 1;
      const progreso = Object.entries(ascenso.requisitos)
        .map(([tier, req]) => `Rango ${tier}: **${conteo[tier] || 0}/${req}**`)
        .join(' | ');
      return message.reply(`✅ **Misión completada** para **${target.username}**.\n📊 Progreso hacia **${ascenso.siguiente}**: ${progreso}`);
    }

    message.reply(`✅ **Misión completada** para **${target.username}**.`);
  }
};
