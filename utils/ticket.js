const {
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require('discord.js');

const config = require('../config');
const { getNextTicketId } = require('./idTracker');
const { setTicketCreator } = require('./ticketStorage');

async function createTicketThread(interaction) {
  const { guild, user, channel } = interaction;

  await interaction.deferReply({ flags: 64 });

  const ticketId = getNextTicketId();
  const threadName = `Ticket-${ticketId}`;

  const ticketThread = await channel.threads.create({
    name: threadName,
    type: ChannelType.PrivateThread,
    reason: `Ticket created by ${user.tag}`,
  });

  // Legg til oppretter
  await ticketThread.members.add(user.id);
  setTicketCreator(ticketThread.id, user.id);

  // Legg til kun defaultSupportRoles
  const fetchedMembers = await guild.members.fetch();
  const supportMembers = fetchedMembers.filter(member =>
    member.roles.cache.some(role => config.defaultSupportRoles.includes(role.id))
  );

  for (const [memberId] of supportMembers) {
    await ticketThread.members.add(memberId).catch(() => {});
  }

  const embed = new EmbedBuilder()
    .setTitle('🎟️ Ticket created')
    .setDescription(`Hello ${user}, please describe what you need help with.\nThe support team has been notified.`)
    .setColor(0x2f3136)
    .setFooter({ text: `Legacy DEV Team | Ticket ID: ${ticketId}` });

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('claim_ticket').setLabel('Claim').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('promote_ticket').setLabel('Escalate').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('close_ticket').setLabel('Close').setStyle(ButtonStyle.Danger)
  );

  await ticketThread.send({ embeds: [embed], components: [buttons] });
  await interaction.editReply({ content: `✅ Your ticket has been created: ${threadName}` });

  if (config.ticketLogChannelId) {
    const logChannel = guild.channels.cache.get(config.ticketLogChannelId);
    if (logChannel) {
      logChannel.send(`🎟️ New ticket created: ${threadName} by ${user.tag}`);
    }
  }
}

async function sendEscalateMenu(interaction) {
  const options = config.promoteRoles.map(roleId => {
    const role = interaction.guild.roles.cache.get(roleId);
    return new StringSelectMenuOptionBuilder()
      .setLabel(role ? role.name : `Unknown role: ${roleId}`)
      .setValue(roleId);
  });

  const menu = new StringSelectMenuBuilder()
    .setCustomId('escalate_select')
    .setPlaceholder('Select role for escalation...')
    .addOptions(options);

  await interaction.reply({
    content: '📈 Choose a role to escalate the ticket to:',
    components: [{ type: 1, components: [menu] }],
    flags: 64
  });
}

async function escalateTicketThread(interaction, selectedRoleId) {
  await interaction.deferUpdate();

  const thread = await interaction.channel.fetch(true);
  await thread.setArchived(false, 'Escalation requires open thread');
  await thread.members.add(interaction.client.user.id).catch(() => {});

  const guild = interaction.guild;
  const promoteRoles = config.promoteRoles;
  const selectedIndex = promoteRoles.indexOf(selectedRoleId);

  if (selectedIndex === -1) {
    await thread.send({ content: '❌ Invalid escalation role selected.' });
    return;
  }

  const threadMembers = await thread.members.fetch();
  const threadMemberIds = threadMembers.map(m => m.user.id);

  let currentIndex = -1;
  for (let i = 0; i < promoteRoles.length; i++) {
    const role = guild.roles.cache.get(promoteRoles[i]);
    if (role && role.members.some(member => threadMemberIds.includes(member.id))) {
      currentIndex = i;
      break;
    }
  }

  if (currentIndex >= selectedIndex) {
    await thread.send({
      content: `⚠️ Escalation to the same or lower level is not allowed.`
    });
    return;
  }

  const lowerRoles = promoteRoles.slice(0, selectedIndex);
  for (const roleId of lowerRoles) {
    const role = guild.roles.cache.get(roleId);
    if (!role) continue;

    for (const [memberId] of role.members) {
      await thread.members.remove(memberId).catch(() => {});
    }
  }

  const promoteRole = guild.roles.cache.get(selectedRoleId);
  if (promoteRole) {
    for (const [memberId] of promoteRole.members) {
      await thread.members.add(memberId).catch(() => {});
    }

    const embed = new EmbedBuilder()
      .setTitle('📈 Ticket Escalated')
      .setDescription(`Ticket escalated by ${interaction.user} to **${promoteRole.name}**.`)
      .setColor(0x3498db)
      .setTimestamp()
      .setFooter({ text: 'Legacy DEV Team | Escalation Log' });

    await thread.send({
      content: `<@&${promoteRole.id}>`,
      embeds: [embed]
    });
  } else {
    await thread.send({ content: '❌ Could not resolve selected role.' });
  }
}

module.exports = {
  createTicketThread,
  sendEscalateMenu,
  escalateTicketThread
};
