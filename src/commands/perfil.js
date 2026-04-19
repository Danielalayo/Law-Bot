const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const profileManager = require('../managers/profileManager');
const misionManager = require('../managers/misionManager');
const tiers = require('../config/misiones');

function buildEmbed(target, profile) {
  return new EmbedBuilder()
    .setColor(0xFF0000)
    .setTitle(`📜 **Perfil de ${target.username}**`)
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: '👤 Nombre', value: `**${target.username}**`,          inline: true },
      { name: '💰 Dinero', value: `**${profile.dinero || 0} ryos**`, inline: true }
    )
    .setFooter({ text: 'Law Bot - Servidor de rol' });
}

function buildBuildEmbed(target, profile) {
  return new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(`🔨 **Build de ${target.username}**`)
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: '🏯 Clan',          value: profile.clan     ? `**${profile.clan}**`     : '**Sin asignar**',       inline: true },
      { name: '👁️ Doujutsu',      value: profile.doujutsu ? `**${profile.doujutsu}**` : '**Sin asignar**',       inline: true },
      { name: '🧬 Kekkei Genkai', value: profile.kkg      ? `**${profile.kkg}**`      : '**Sin Kekkei Genkai**', inline: true },
      { name: '🌊 Elemento',      value: profile.elemento ? `**${profile.elemento}**` : '**Sin asignar**',       inline: true },
      { name: '🦊 Bijuu',         value: profile.bijuu    ? `**${profile.bijuu}**`    : '**Sin Bijuu**',         inline: true }
    )
    .setFooter({ text: 'Law Bot - Servidor de rol' });
}

function buildProgresoEmbed(target, profile) {
  const exp = profile.doujutsuExp || 0;
  const porcentaje = Math.min(exp, 100);
  const barFilled = Math.round(porcentaje / 10);
  const bar = '█'.repeat(barFilled) + '░'.repeat(10 - barFilled);

  const embed = new EmbedBuilder()
    .setColor(0xFFAA00)
    .setTitle(`📈 **Progreso de ${target.username}**`)
    .setThumbnail(target.displayAvatarURL());

  if (profile.doujutsu) {
    embed.addFields({
      name: `👁️ ${profile.doujutsu}`,
      value: `\`[${bar}]\` **${porcentaje}/100**`,
      inline: false
    });
  } else {
    embed.addFields({ name: '👁️ Doujutsu', value: '**No tienes doujutsu**', inline: false });
  }

  embed.setFooter({ text: 'Law Bot - Servidor de rol' });
  return embed;
}

function buildMisionesEmbed(target) {
  const data = misionManager.getUserMisiones(target.id);

  const embed = new EmbedBuilder()
    .setColor(0x8B0000)
    .setTitle(`📋 **Misiones de ${target.username}**`)
    .setThumbnail(target.displayAvatarURL());

  // Activas agrupadas por tier
  const activasPorTier = {};
  for (const m of data.activas) {
    if (!activasPorTier[m.tier]) activasPorTier[m.tier] = [];
    activasPorTier[m.tier].push(m);
  }

  if (data.activas.length === 0) {
    embed.addFields({ name: '⚔️ Misiones Activas', value: '**Sin misiones activas**', inline: false });
  } else {
    for (const tier of ['S', 'A', 'B', 'C', 'D']) {
      if (!activasPorTier[tier]) continue;
      const t = tiers[tier];
      const lista = activasPorTier[tier].map(m => `${t.emoji} **${m.nombre}** — \`ID: ${m.id}\``).join('\n');
      embed.addFields({ name: `${t.emoji} **${t.label} — Activas**`, value: lista, inline: false });
    }
  }

  // Completadas agrupadas por tier
  const completadasPorTier = {};
  for (const m of data.completadas) {
    if (!completadasPorTier[m.tier]) completadasPorTier[m.tier] = [];
    completadasPorTier[m.tier].push(m);
  }

  if (data.completadas.length === 0) {
    embed.addFields({ name: '✅ Misiones Completadas', value: '**Sin misiones completadas**', inline: false });
  } else {
    for (const tier of ['S', 'A', 'B', 'C', 'D']) {
      if (!completadasPorTier[tier]) continue;
      const t = tiers[tier];
      const lista = completadasPorTier[tier].map(m => `✅ **${m.nombre}**`).join('\n');
      embed.addFields({ name: `${t.emoji} **${t.label} — Completadas**`, value: lista, inline: false });
    }
  }

  embed.setFooter({ text: 'Law Bot - Servidor de rol' });
  return embed;
}

function getRow(active) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('perfil_main')
      .setLabel('Perfil')
      .setStyle(active === 'main' ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('perfil_build')
      .setLabel('Build')
      .setStyle(active === 'build' ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('perfil_progreso')
      .setLabel('Progreso')
      .setStyle(active === 'progreso' ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('perfil_misiones')
      .setLabel('Misiones')
      .setStyle(active === 'misiones' ? ButtonStyle.Primary : ButtonStyle.Secondary)
  );
}

module.exports = {
  name: 'perfil',
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const userId = target.id;

    let profile = profileManager.getProfile(userId);
    if (!profile) profile = profileManager.createProfile(userId, target.username);

    const reply = await message.reply({
      embeds: [buildEmbed(target, profile)],
      components: [getRow('main')]
    });

    const collector = reply.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: '❌ **Este perfil no es tuyo.**', ephemeral: true });
      }

      profile = profileManager.getProfile(userId) || profile;

      if (interaction.customId === 'perfil_main') {
        await interaction.update({ embeds: [buildEmbed(target, profile)], components: [getRow('main')] });
      } else if (interaction.customId === 'perfil_build') {
        await interaction.update({ embeds: [buildBuildEmbed(target, profile)], components: [getRow('build')] });
      } else if (interaction.customId === 'perfil_progreso') {
        await interaction.update({ embeds: [buildProgresoEmbed(target, profile)], components: [getRow('progreso')] });
      } else if (interaction.customId === 'perfil_misiones') {
        await interaction.update({ embeds: [buildMisionesEmbed(target)], components: [getRow('misiones')] });
      }
    });

    collector.on('end', () => {
      reply.edit({ components: [] }).catch(() => {});
    });
  }
};
