const { REST, Routes } = require('discord.js');
const config = require('./config');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) { 
const command = require(`./commands/${file}`); 
commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => { 
try { 
console.log(`🚀 Logging ${commands.length} slash command(s)...`); 

await rest.put( 
Routes.applicationGuildCommands(config.clientId, config.guildId), 
{ body: commands }, 
); 

console.log(' ✅ Slash command(s) registered.'); 
} catch (error) { 
console.error('❌ Could not register commands:', error); 
}
})();