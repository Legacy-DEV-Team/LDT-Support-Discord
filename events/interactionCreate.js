const {
  createTicketThread,
  sendEscalateMenu,
  escalateTicketThread
} = require('../utils/ticket');

const { isCreator } = require('../utils/ticketStorage');
const config = require('../config');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Slash-kommandoer
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: '❌ An error occurred.', flags: 64 });
        } else {
          await interaction.reply({ content: '❌ An error occurred.', flags: 64 });
        }
      }
    }

    // Knapp-interaksjoner
    if (interaction.isButton()) {
      const thread = interaction.channel;

      if (thread.isThread() && thread.archived) {
        try {
          await thread.setArchived(false, 'Unarchive thread for interaction');
        } catch (err) {
          console.warn(`⚠️ Could not unarchive thread: ${err.message}`);
        }
      }

      switch (interaction.customId) {
        case 'create_ticket':
          await createTicketThread(interaction);
          break;

        case 'claim_ticket': {
          if (!thread.isThread()) return;

          const member = await interaction.guild.members.fetch(interaction.user.id);
          const hasClaimRole = member.roles.cache.some(role =>
            config.claimRoles.includes(role.id)
          );

          if (!hasClaimRole) {
            return interaction.reply({
              content: '❌ You do not have permission to claim this ticket.',
              flags: 64
            });
          }

          await interaction.reply({
            content: `🎯 Ticket claimed by ${interaction.user}.`,
            flags: 64
          });
          break;
        }

        case 'promote_ticket': {
          if (!thread.isThread()) return;

          const member = await interaction.guild.members.fetch(interaction.user.id);
          const hasPromoteRole = member.roles.cache.some(role =>
            config.promoteRoles.includes(role.id)
          );

          if (!hasPromoteRole) {
            return interaction.reply({
              content: '❌ You do not have permission to escalate this ticket.',
              flags: 64
            });
          }

          await sendEscalateMenu(interaction);
          break;
        }

        case 'close_ticket': {
          if (!thread.isThread()) return;

          const member = await interaction.guild.members.fetch(interaction.user.id);
          const hasCloseRole = member.roles.cache.some(role =>
            config.closeRoles.includes(role.id)
          );
          const isTicketCreator = isCreator(thread.id, interaction.user.id);

          if (!hasCloseRole && !isTicketCreator) {
            return interaction.reply({
              content: '❌ You do not have permission to close this ticket.',
              flags: 64
            });
          }

          await interaction.reply({ content: '✅ Ticket closed.', flags: 64 });

          try {
            await thread.send(`🚫 Ticket closed by ${interaction.user}.`);
            await thread.setLocked(true, 'Ticket closed and locked');   // 🔐
            await thread.setArchived(true, 'Ticket archived');
          } catch (err) {
            console.error('❌ Failed to close thread:', err);
          }

          break;
        }

        case 'reopen_ticket': {
          if (!thread.isThread()) return;

          const member = await interaction.guild.members.fetch(interaction.user.id);
          const hasReopenRole = member.roles.cache.some(role =>
            config.reopenRoles.includes(role.id)
          );
          const isTicketCreator = isCreator(thread.id, interaction.user.id);

          if (!hasReopenRole && !isTicketCreator) {
            return interaction.reply({
              content: '❌ You do not have permission to reopen this ticket.',
              flags: 64
            });
          }

          try {
            await thread.setLocked(false, 'Reopening ticket');         // 🔓
            await thread.setArchived(false, 'Ticket reopened');
            await thread.send(`✅ Ticket reopened by ${interaction.user}.`);
            await interaction.reply({ content: '✅ Ticket reopened.', flags: 64 });
          } catch (err) {
            console.error('❌ Failed to reopen ticket:', err);
            await interaction.reply({ content: '❌ Could not reopen ticket.', flags: 64 });
          }

          break;
        }

        default:
          await interaction.reply({ content: '❌ Unknown action.', flags: 64 });
      }
    }

    // Select-meny for eskalering
    if (interaction.isStringSelectMenu() && interaction.customId === 'escalate_select') {
      const selectedRoleId = interaction.values[0];
      await escalateTicketThread(interaction, selectedRoleId);
    }
  }
};
