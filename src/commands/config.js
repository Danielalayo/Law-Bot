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
      { name: '🏘️ Aldea',         value: `**${profile.aldea     || 'Sin asignar'}**`,       inline: true },
      { name: '✨ Talento',        value: `**${profile.talento   || 'Sin asignar'}**`,       inline: true },
    )
    .setDescription('**Selecciona qué quieres editar:**')
    .setFooter({ text: 'Law Bot - Config de usuario' });
}

function menuPrincipal() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_campo')
      .setPlaceholder('Selecciona un campo a editar...')
      .addOptions([
        { label: '🏯 Clan',          value: 'clan'     },
        { label: '🌊 Elemento',      value: 'elemento' },
        { label: '🧬 Kekkei Genkai', value: 'kkg'      },
        { label: '⚔️ Rango',         value: 'rango'    },
        { label: '🦊 Bijuu',         value: 'bijuu'    },
        { label: '🏘️ Aldea',         value: 'aldea'    },
        { label: '✨ Talento',        value: 'talento'  },
      ])
  );
}

function menuClanes() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_clan')
      .setPlaceholder('Selecciona un clan...')
      .addOptions(clanes.map(c => ({ label: c.nombre, value: c.nombre })))
  );
}

function menuElementos() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_elemento')
      .setPlaceholder('Selecciona un elemento...')
      .addOptions(elementos.map(e => ({ label: e, value: e })))
  );
}

function menuKKG() {
  const opciones = clanes
    .filter(c => c.kkg)
    .map(c => ({ label: c.kkg, value: c.kkg, description: `Clan ${c.nombre}` }));
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
  opciones.push({ label: 'Sin Bijuu', value: 'none' });
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_bijuu')
      .setPlaceholder('Selecciona un Bijuu...')
      .addOptions(opciones)
  );
}

function menuTalento() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_talento')
      .setPlaceholder('Selecciona un talento...')
      .addOptions([
        { label: 'Prodigio', value: 'Prodigio' },
        { label: 'Genio',    value: 'Genio'    },
        { label: 'Normal',   value: 'Normal'   },
      ])
  );
}

function menuAldea() {
  const aldeas = ['Konoha', 'Suna', 'Kiri', 'Kumo', 'Iwa', 'Oto', 'Ame', 'Sin Aldea'];
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_aldea')
      .setPlaceholder('Selecciona una aldea...')
      .addOptions(aldeas.map(a => ({ label: a, value: a })))
  );
}

function menuRango() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('cfg_valor_rango')
      .setPlaceholder('Selecciona un rango...')
      .addOptions(['Genin', 'Chunin', 'Jonin', 'ANBU', 'Kage'].map(r => ({ label: r, value: r })))
  );
}

function botonVolver() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('cfg_volver').setLabel('← Volver').setStyle(ButtonStyle.Secondary)
  );
}

module.exports = {
  name: 'config',
  async execute(message, args) {
    if (!hasStaffPerms(message.member))
      return message.reply('❌ **No tienes permisos para usar este comando.**');

    const target = message.mentions.users.first();
    if (!target) return message.reply('❌ **Uso:** `+config @usuario`');

    let profile = await profileManager.getProfile(target.id);
    if (!profile) profile = await profileManager.createProfile(target.id, target.username);

    const reply = await message.reply({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
    const collector = reply.createMessageComponentCollector({ time: 120000 });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id)
        return interaction.reply({ content: '❌ **Este menú no es tuyo.**', ephemeral: true });

      profile = await profileManager.getProfile(target.id) || profile;

      if (interaction.customId === 'cfg_campo') {
        const campo = interaction.values[0];
        const menus = { clan: menuClanes, elemento: menuElementos, kkg: menuKKG, rango: menuRango, bijuu: menuBijuus, aldea: menuAldea, talento: menuTalento };
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menus[campo](), botonVolver()] });
      }

      else if (interaction.customId === 'cfg_valor_clan') {
        const clanNombre = interaction.values[0];
        const clanData = clanes.find(c => c.nombre === clanNombre);
        await profileManager.updateProfile(target.id, { clan: clanNombre, doujutsu: clanData?.doujutsu || null, kkg: clanData?.kkg || null });
        profile = await profileManager.getProfile(target.id);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      else if (interaction.customId === 'cfg_valor_elemento') {
        await profileManager.updateProfile(target.id, { elemento: interaction.values[0] });
        profile = await profileManager.getProfile(target.id);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      else if (interaction.customId === 'cfg_valor_kkg') {
        const val = interaction.values[0];
        await profileManager.updateProfile(target.id, { kkg: val === 'none' ? null : val });
        profile = await profileManager.getProfile(target.id);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      else if (interaction.customId === 'cfg_valor_rango') {
        await profileManager.updateProfile(target.id, { rango: interaction.values[0] });
        profile = await profileManager.getProfile(target.id);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      else if (interaction.customId === 'cfg_valor_bijuu') {
        const val = interaction.values[0];
        await profileManager.updateProfile(target.id, { bijuu: val === 'none' ? null : val });
        profile = await profileManager.getProfile(target.id);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      else if (interaction.customId === 'cfg_valor_aldea') {
        await profileManager.updateProfile(target.id, { aldea: interaction.values[0] });
        profile = await profileManager.getProfile(target.id);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      else if (interaction.customId === 'cfg_valor_talento') {
        await profileManager.updateProfile(target.id, { talento: interaction.values[0] });
        profile = await profileManager.getProfile(target.id);
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }

      else if (interaction.customId === 'cfg_volver') {
        await interaction.update({ embeds: [buildResumenEmbed(target, profile)], components: [menuPrincipal()] });
      }
    });

    collector.on('end', () => reply.edit({ components: [] }).catch(() => {}));
  }
};
