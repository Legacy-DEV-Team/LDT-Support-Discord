const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearlog')
    .setDescription('Clear all messages in the ticket log channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const { user, guild } = interaction;

    if (user.id !== config.ownerId) {
      return interaction.reply({ content: '❌ Only the server owner can use this command.', flags: 64 });
    }

    const logChannel = guild.channels.cache.get(config.ticketLogChannelId);

    if (!logChannel || !logChannel.isTextBased()) {
      return interaction.reply({ content: '❌ Ticket log channel not found or is not a text channel.', flags: 64 });
    }

    try {
      let messages;
      do {
        messages = await logChannel.messages.fetch({ limit: 100 });
        if (messages.size > 0) {
          await logChannel.bulkDelete(messages, true);
        }
      } while (messages.size >= 2); // Discord may skip some system messages

      await interaction.reply({ content: '🧹 Log channel has been cleared.', flags: 64 });
    } catch (error) {
      console.error('Failed to clear log channel:', error);
      await interaction.reply({ content: '❌ Could not clear the log channel.', flags: 64 });
    }
  }
};
