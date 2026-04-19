const profileManager = require('../managers/profileManager');
const misionManager = require('../managers/misionManager');
const ascensos = require('../config/ascensos');

function verificarAscenso(profile, misiones) {
  const rangoActual = profile.rango || 'Genin';
  const ascenso = ascensos[rangoActual];
  if (!ascenso) return null; // Kage, rango máximo

  const completadas = misiones.completadas;

  // Contar completadas por tier
  const conteo = {};
  for (const m of completadas) {
    conteo[m.tier] = (conteo[m.tier] || 0) + 1;
  }

  // Verificar si cumple todos los requisitos
  for (const [tier, cantidad] of Object.entries(ascenso.requisitos)) {
    if ((conteo[tier] || 0) < cantidad) return null;
  }

  return ascenso.siguiente;
}

module.exports = {
  name: 'completarmision',
  async execute(message, args) {
    if (!message.member.permissions.has('Administrator')) {
      return message.reply('❌ **No tienes permisos para usar este comando.**');
    }

    const target = message.mentions.users.first();
    const misionId = args[1];

    if (!target || !misionId) {
      return message.reply('❌ **Uso:** `+completarmision @usuario <id_mision>`');
    }

    const ok = misionManager.completarMision(target.id, misionId);
    if (!ok) return message.reply('❌ **No se encontró la misión activa con ese ID.**');

    // Verificar ascenso
    const profile = profileManager.getProfile(target.id);
    const misiones = misionManager.getUserMisiones(target.id);
    const nuevoRango = verificarAscenso(profile, misiones);

    if (nuevoRango) {
      profileManager.updateProfile(target.id, { rango: nuevoRango });
      return message.reply(
        `✅ **Misión completada** para ${target}.\n🎉 **¡${target.username} ha ascendido a ${nuevoRango}!**`
      );
    }

    // Mostrar progreso hacia el siguiente rango
    const rangoActual = profile.rango || 'Genin';
    const ascenso = ascensos[rangoActual];
    if (ascenso) {
      const completadas = misiones.completadas;
      const conteo = {};
      for (const m of completadas) conteo[m.tier] = (conteo[m.tier] || 0) + 1;

      const progreso = Object.entries(ascenso.requisitos)
        .map(([tier, req]) => `Rango ${tier}: **${conteo[tier] || 0}/${req}**`)
        .join(' | ');

      return message.reply(`✅ **Misión completada** para ${target}.\n📊 Progreso hacia **${ascenso.siguiente}**: ${progreso}`);
    }

    message.reply(`✅ **Misión completada** para ${target}.`);
  }
};
