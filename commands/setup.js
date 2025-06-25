const {
  SlashCommandBuilder,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require('discord.js');

const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Initialize the ticket system in this channel.'),

  async execute(interaction) {
    const isBotOwner = interaction.user.id === config.ownerId;
    const isGuildOwner = interaction.guild.ownerId === interaction.user.id;

    if (!isBotOwner && !isGuildOwner) {
      return await interaction.reply({
        content: '❌ Only the server owner or bot owner can run this command.',
        flags: 64
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🆘 LDT Support')
      .setDescription('Click the button below to create a ticket.\nOur team will assist you shortly.')
      .setColor(0x2f3136)
      .setFooter({ text: 'Legacy DEV Team | LDT Support' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: '✅ Ticket system has been set up in this channel.',
      flags: 64
    });

    await interaction.channel.send({ embeds: [embed], components: [row] });
  }
};
