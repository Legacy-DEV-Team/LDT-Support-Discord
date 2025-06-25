const { 
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags
} = require('discord.js');

module.exports = { 
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Initializing LDT Support system in this channel.')
    .addSubcommand(sub =>
      sub
        .setName('ldtsupport')
        .setDescription('Sets up ticket system with button in this channel.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const embed = new EmbedBuilder()
      .setTitle('🆘 LDT Support')
      .setDescription('Click the button below to create a ticket.\nOur team will help you as soon as possible.')
      .setColor(0x2f3136)
      .setFooter({ text: 'Legacy DEV Team | LDT Support' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: '✅ Setup complete!',
      flags: MessageFlags.Ephemeral
    });

    await interaction.channel.send({ embeds: [embed], components: [row] });
  }
};
