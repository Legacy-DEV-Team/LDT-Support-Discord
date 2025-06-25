const { createTicketThread, sendEscalateMenu, escalateTicketThread } = require('../utils/ticket');
const config = require('../config');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ An error occurred.', flags: 64 });
      }
    }

    // Handle buttons
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case 'create_ticket':
          await createTicketThread(interaction);
          break;

        case 'claim_ticket':
          await interaction.reply({ content: `🎯 Ticket claimed by ${interaction.user}.` });
          break;

        case 'promote_ticket':
          await sendEscalateMenu(interaction);
          break;

        case 'close_ticket':
          // ✅ Send svar først, så arkiver tråden
          await interaction.reply({ content: `✅ Ticket closed by ${interaction.user}.` });
          await interaction.channel.setArchived(true, 'Ticket closed');
          break;

        default:
          await interaction.reply({ content: '❌ Unknown action.', flags: 64 });
      }
    }

    // Handle escalate select menu
    if (interaction.isStringSelectMenu() && interaction.customId === 'escalate_select') {
      const selectedRoleId = interaction.values[0];

      // 👇 Gjenåpne tråden om nødvendig
      if (interaction.channel.archived) {
        await interaction.channel.setArchived(false, 'Reopened for escalation');
      }

      await escalateTicketThread(interaction, selectedRoleId);
    }
  }
};
