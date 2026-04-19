const {
  EmbedBuilder, ActionRowBuilder,
  StringSelectMenuBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');
const profileManager = require('../managers/profileManager');
const clanes = require('../config/clanes');
const elementos = require('../config/elementos');
const bijuus = require('../config/bijuus');

function hasStaffPerms(member) {
  return member.permissions.has('Administrator') ||
         member.permissions.has('ModerateMembers') ||
         member.permissions.has('ManageGuild');
}

function buildResumenEmbed(target, profile) {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle(`⚙️ **Config de ${target.username}**`)
    .setThumbnail(target.displayAvatarURL())
    .addFields(
      { name: '🏯 Clan',          value: `**${profile.clan      || 'Sin asignar'}**`,       inline: true },
      { name: '👁️ Doujutsu',      value: `**${profile.doujutsu  || 'Sin asignar'}**`,       inline: true },
      { name: '🧬 Kekkei Genkai', value: `**${profile.kkg       || 'Sin Kekkei Genkai'}**`, inline: true },
      { name: '🌊 Elemento',      value: `**${profile.elemento  || 'Sin asignar'}**`,       inline: true },
      { name: '⚔️ Rango',         value: `**${profile.rango     || 'Genin'}**`,             inline: true },
      { name: '🦊 Bijuu',         value: `**${profile.bijuu     || 'Sin Bijuu'}**`,         inline: true },
    )
    .setDescription('**Selecciona qué quieres editar:**')
    .setFooter({ text: 'Law Bot - Config de usuario' });
}

// Menú principal: qué campo editar
function menuPrincipal() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_campo')
      .setPlaceholder('Selecciona un campo a editar...')
      .addOptions([
        { label: '🏯 Clan',          value: 'clan',     description: 'Cambiar el clan del usuario' },
        { label: '🌊 Elemento',      value: 'elemento', description: 'Cambiar el elemento del usuario' },
        { label: '🧬 Kekkei Genkai', value: 'kkg',      description: 'Cambiar el KKG del usuario' },
        { label: '⚔️ Rango',         value: 'rango',    description: 'Cambiar el rango del usuario' },
        { label: '🦊 Bijuu',         value: 'bijuu',    description: 'Asignar o quitar un Bijuu' },
      ])
  );
}

function menuClanes() {
  const opciones = clanes.map(c => ({ label: c.nombre, value: c.nombre }));
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_clan')
      .setPlaceholder('Selecciona un clan...')
      .addOptions(opciones)
  );
}

function menuElementos() {
  const opciones = elementos.map(e => ({ label: e, value: e }));
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_elemento')
      .setPlaceholder('Selecciona un elemento...')
      .addOptions(opciones)
  );
}

function menuKKG(clanActual) {
  const clanData = clanes.find(c => c.nombre === clanActual);
  const opciones = [];

  if (clanData?.kkg) opciones.push({ label: clanData.kkg, value: clanData.kkg });
  opciones.push({ label: 'Sin Kekkei Genkai', value: 'none' });

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_kkg')
      .setPlaceholder('Selecciona un KKG...')
      .addOptions(opciones)
  );
}

function menuBijuus() {
  const opciones = bijuus.map(b => ({
    label: `${'⭐'.repeat(Math.min(b.colas, 5))} ${b.nombre} (${b.colas} cola${b.colas > 1 ? 's' : ''})`,
    value: b.nombre,
    description: b.descripcion
  }));
  opciones.push({ label: 'Sin Bijuu', value: 'none', description: 'Quitar el Bijuu del usuario' });
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_bijuu')
      .setPlaceholder('Selecciona un Bijuu...')
      .addOptions(opciones)
  );
}

function menuRango() {
  const rangos = ['Genin', 'Chunin', 'Jonin', 'ANBU', 'Kage'];
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_rango')
      .setPlaceholder('Selecciona un rango...')
      .addOptions(rangos.map(r => ({ label: r, value: r })))
  );
}

function botonVolver() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('cfg_volver')
      .setLabel('← Volver')
      .setStyle(ButtonStyle.Secondary)
  );
}

module.exports = {
  name: 'config',
  async execute(message, args) {
    if (!hasStaffPerms(message.member)) {
      return message.reply('❌ **No tienes permisos para usar este comando.**');
    }

    const target = message.mentions.users.first();
    if (!target) return message.reply('❌ **Uso:** `+config @usuario`');

    const userId = target.id;
    let profile = profileManager.getProfile(userId);
    if (!profile) profile = profileManager.createProfile(userId, target.username);

    const reply = await message.reply({
      embeds: [buildResumenEmbed(target, profile)],
      components: [menuPrincipal()]
    });

    const collector = reply.createMessageComponentCollector({ time: 120000 });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: '❌ **Este menú no es tuyo.**', ephemeral: true });
      }

      profile = profileManager.getProfile(userId) || profile;

      // Selección de campo a editar
      if (interaction.customId === 'cfg_campo') {
        const campo = interaction.values[0];
        if (campo === 'clan') {
          await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuClanes(), botonVolver()] });
        } else if (campo === 'elemento') {
          await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuElementos(), botonVolver()] });
        } else if (campo === 'kkg') {
          await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuKKG(profile.clan), botonVolver()] });
        } else if (campo === 'rango') {
          await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuRango(), botonVolver()] });
        } else if (campo === 'bijuu') {
          await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuBijuus(), botonVolver()] });
        }
      }

      // Guardar clan
      else if (interaction.customId === 'cfg_valor_clan') {
        const clanNombre = interaction.values[0];
        const clanData = clanes.find(c => c.nombre === clanNombre);
        profileManager.updateProfile(userId, {
          clan: clanNombre,
          doujutsu: clanData?.doujutsu || null,
          kkg: clanData?.kkg || null
        });
        profile = profileManager.getProfile(userId);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      // Guardar elemento
      else if (interaction.customId === 'cfg_valor_elemento') {
        profileManager.updateProfile(userId, { elemento: interaction.values[0] });
        profile = profileManager.getProfile(userId);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      // Guardar KKG
      else if (interaction.customId === 'cfg_valor_kkg') {
        const val = interaction.values[0];
        profileManager.updateProfile(userId, { kkg: val === 'none' ? null : val });
        profile = profileManager.getProfile(userId);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      // Guardar rango
      else if (interaction.customId === 'cfg_valor_rango') {
        profileManager.updateProfile(userId, { rango: interaction.values[0] });
        profile = profileManager.getProfile(userId);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      // Guardar Bijuu
      else if (interaction.customId === 'cfg_valor_bijuu') {
        const val = interaction.values[0];
        profileManager.updateProfile(userId, { bijuu: val === 'none' ? null : val });
        profile = profileManager.getProfile(userId);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      // Volver al menú principal
      else if (interaction.customId === 'cfg_volver') {
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }
    });

    collector.on('end', () => {
      reply.edit({ components: [] }).catch(() => {});
    });
  }
};
