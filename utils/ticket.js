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

async function createTicketThread(interaction) {
  const { guild, user, channel } = interaction;

  await interaction.deferReply({ flags: 64 });

  const threadName = `ticket-${user.username}-${user.discriminator}`;

  const ticketThread = await channel.threads.create({
    name: threadName,
    type: ChannelType.PrivateThread,
    reason: `Ticket created by ${user.tag}`,
  });

  const allowedRoles = config.defaultSupportRoles;
  const allowedMembers = allowedRoles
    .map(roleId => guild.roles.cache.get(roleId))
    .filter(role => role);

  await ticketThread.members.add(user.id);
  for (const role of allowedMembers) {
    await ticketThread.send({ content: `<@&${role.id}>` });
  }

  const embed = new EmbedBuilder()
    .setTitle('🎟️ Ticket created')
    .setDescription(`Hello ${user}, please describe what you need help with.\nThe support team has been notified.`)
    .setColor(0x2f3136)
    .setFooter({ text: 'Legacy DEV Team | LDT Support' });

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('claim_ticket').setLabel('Claim').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('promote_ticket').setLabel('Escalate').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('close_ticket').setLabel('Close').setStyle(ButtonStyle.Danger)
  );

  await ticketThread.send({ embeds: [embed], components: [buttons] });

  await interaction.editReply({ content: `✅ Your ticket has been created: ${ticketThread}` });

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
  const thread = interaction.channel;
  const role = interaction.guild.roles.cache.get(selectedRoleId);

  if (!role) {
    await interaction.reply({ content: '❌ Role not found.', flags: 64 });
    return;
  }

  try {
    if (thread.archived) {
      await thread.setArchived(false, 'Reopened for escalation');
    }

    const membersWithRole = role.members;

    for (const [memberId] of membersWithRole) {
      await thread.members.add(memberId);
    }

    await thread.send(`📈 Ticket escalated to <@&${role.id}> by ${interaction.user}.`);
    await interaction.reply({ content: `✅ Ticket successfully escalated to ${role.name}.`, flags: 64 });

  } catch (error) {
    console.error('Failed to escalate ticket:', error);
    await interaction.reply({ content: '❌ Failed to escalate ticket.', flags: 64 });
  }
}

module.exports = {
  createTicketThread,
  sendEscalateMenu,
  escalateTicketThread
};
