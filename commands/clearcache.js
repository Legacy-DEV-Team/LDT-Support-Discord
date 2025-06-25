const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearcache')
    .setDescription('Clears guild member cache (owner only).')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    // Bekreft at bruker er eier
    if (interaction.user.id !== config.ownerId) {
      return await interaction.reply({ content: '❌ You are not allowed to use this command.', flags: 64 });
    }

    try {
      interaction.guild.members.cache.clear();
      await interaction.reply({ content: '🧹 Cache has been cleared.', flags: 64 });
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
      await interaction.reply({ content: '❌ Failed to clear cache.', flags: 64 });
    }
  }
};
