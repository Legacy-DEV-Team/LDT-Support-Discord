const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const client = new Client({ 
intents: [ 
GatewayIntentBits.Guilds, 
GatewayIntentBits.GuildMessages, 
GatewayIntentBits.GuildMembers, 
GatewayIntentBits.MessageContent 
], 
partials: [Partials.Channel, Partials.Message]
});

client.commands = new Collection();

// Load commands dynamically
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) { 
const command = require(`./commands/${file}`); 
client.commands.set(command.data.name, command);
}

// Load event listeners
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) { 
const event = require(`./events/${file}`); 
if (event.once) { 
client.once(event.name, (...args) => event.execute(...args, client)); 
} else { 
client.on(event.name, (...args) => event.execute(...args, client)); 
}
}

client.login(config.token);