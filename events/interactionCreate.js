const { createTicketThread, sendEscalateMenu } = require('../utils/ticket');
const config = require('../config');

module.exports = { 
name: 'interactionCreate', 
async execute(interaction, client) { 
if (interaction.isChatInputCommand()) { 
const command = client.commands.get(interaction.commandName); 
if (!command) return; 

try { 
await command. execute(interaction, client); 
} catch (error) { 
console.error(error); 
await interaction.reply({ content: '❌ An error occurred.', ephemeral: true }); 
} 
} 

if (interaction.isButton()) { 
switch (interaction.customId) { 
case 'create_ticket': 
await createTicketThread(interaction); 
breaks; 

case 'claim_ticket': 
await interaction.reply({ content: `🎯 Ticket claimed by ${interaction.user}.`, ephemeral: false }); 
breaks; 

case 'promote_ticket': 
await sendEscalateMenu(interaction); 
breaks; 

case 'close_ticket': 
await interaction.channel.setLocked(true); 
await interaction.reply({ content: `​​Ticket closed by ${interaction.user}.`, ephemeral: false }); 
breaks; 

default: 
await interaction.reply({ content: '❌ Unknown action.', ephemeral: true }); 
} 
} 

if (interaction.isStringSelectMenu() && interaction.customId === 'escalate_select') { 
const selectedRoleId = interaction.values[0]; 
const role = interaction.guild.roles.cache.get(selectedRoleId); 

if (role) { 
await interaction.channel.send({ content: `📈 Ticket escalated to <@&${role.id}> by ${interaction.user}.` }); 
await interaction.reply({ content: `​​Ticket successfully escalated to ${role.name}.`, ephemeral: true }); 

await interaction.channel.send(`<@&${role.id}>`); 
} else { 
await interaction.reply({ content: '❌ Role not found.', ephemeral: true }); 
} 
} 
}
};