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
    console.log(`🚀 Registering ${commands.length} slash command(s) to guild ${config.guildId}...`);

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );

    console.log('\x1b[32m%s\x1b[0m', '✅ Slash command(s) registered successfully.');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Failed to register commands:');
    console.error(error);
  }
})();
