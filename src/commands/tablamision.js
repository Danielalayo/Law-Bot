const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const profileManager = require('../managers/profileManager');
const misionManager = require('../managers/misionManager');
const tabla = require('../config/tablaMisiones');
const tiers = require('../config/misiones');

// Rango del usuario → índice numérico
const RANGOS = ['Genin', 'Chunin', 'Jonin', 'ANBU', 'Kage'];

function getRangoIndex(rango) {
  return RANGOS.indexOf(rango ?? 'Genin');
}

function buildTablaEmbed(tierActivo, rangoIndex) {
  const t = tiers[tierActivo];
  const misiones = tabla.filter(m => m.tier === tierActivo);

  const embed = new EmbedBuilder()
    .setColor(0x8B0000)
    .setTitle(`📋 **Tabla de Misiones — ${t.emoji} ${t.label}**`)
    .setDescription('**Escribe el ID de la misión en el chat para solicitarla.**\nEjemplo: `D01`');

  for (const m of misiones) {
    const bloqueada = m.rangoMinimo > rangoIndex;
    embed.addFields({
      name: `${bloqueada ? '🔒' : t.emoji} **[${m.id}] ${m.nombre}**`,
      value: bloqueada
        ? `*Requiere **${RANGOS[m.rangoMinimo]}***`
        : `**${m.descripcion}**`,
      inline: false
    });
  }

  embed.setFooter({ text: 'Law Bot - Panel de Misiones' });
  return embed;
}

function getRow(tierActivo) {
  return new ActionRowBuilder().addComponents(
    ...['D', 'C', 'B', 'A', 'S'].map(t =>
      new ButtonBuilder()
        .setCustomId(`tabla_${t}`)
        .setLabel(`${tiers[t].emoji} ${t}`)
        .setStyle(t === tierActivo ? ButtonStyle.Primary : ButtonStyle.Secondary)
    )
  );
}

module.exports = {
  name: 'tablamision',
  async execute(message) {
    const userId = message.author.id;
    let profile = await profileManager.getProfile(userId);
    if (!profile) profile = await profileManager.createProfile(userId, message.author.username);

    const rangoIndex = getRangoIndex(profile.rango);
    let tierActivo = 'D';

    const reply = await message.reply({
      embeds: [buildTablaEmbed(tierActivo, rangoIndex)],
      components: [getRow(tierActivo)]
    });

    // Collector de botones para cambiar tier
    const btnCollector = reply.createMessageComponentCollector({ time: 120000 });

    // Collector de mensajes para capturar el ID de misión
    const msgCollector = message.channel.createMessageCollector({
      filter: m => m.author.id === userId,
      time: 120000
    });

    btnCollector.on('collect', async interaction => {
      if (interaction.user.id !== userId) {
        return interaction.reply({ content: '❌ **Este menú no es tuyo.**', ephemeral: true });
      }
      tierActivo = interaction.customId.replace('tabla_', '');
      await interaction.update({
        embeds: [buildTablaEmbed(tierActivo, rangoIndex)],
        components: [getRow(tierActivo)]
      });
    });

    msgCollector.on('collect', async msg => {
      const misionId = msg.content.trim().toUpperCase();
      const mision = tabla.find(m => m.id === misionId);

      if (!mision) return; // ignora mensajes que no sean IDs válidos

      // Borrar el mensaje del usuario ya que escribió un ID válido
      msg.delete().catch(() => {});

      // Verificar rango
      if (mision.rangoMinimo > rangoIndex) {
        return message.channel.send(`❌ ${msg.author} **Necesitas ser ${RANGOS[mision.rangoMinimo]} para tomar esta misión.**`);
      }

      // Verificar que no tenga ya esa misión activa
      const userMisiones = await misionManager.getUserMisiones(userId);
      const yaActiva = userMisiones.activas.find(m => m.nombre === mision.nombre);
      if (yaActiva) {
        return message.channel.send(`❌ ${msg.author} **Ya tienes esta misión activa.**`);
      }

      misionManager.agregarMision(userId, { nombre: mision.nombre, tier: mision.tier, descripcion: mision.descripcion });
      await message.channel.send(`✅ ${msg.author} **Misión aceptada:** ${tiers[mision.tier].emoji} **[${mision.tier}] ${mision.nombre}**`);

      // Cerrar collectors
      btnCollector.stop();
      msgCollector.stop();
      reply.edit({ components: [] }).catch(() => {});
    });

    btnCollector.on('end', () => {
      reply.edit({ components: [] }).catch(() => {});
    });
  }
};
