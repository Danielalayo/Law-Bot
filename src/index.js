const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

const PREFIX = process.env.PREFIX || '!';

const commands = {};
const commandsPath = path.join(__dirname, 'commands');

for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  commands[command.name] = command;
  console.log(`📄 Comando cargado: ${command.name}`);
}

client.on('clientReady', () => {
  console.log(`✅ Law conectado como ${client.user.tag}`);
  console.log(`📋 ${Object.keys(commands).length} comandos disponibles`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!commands[commandName]) return;

  try {
    await commands[commandName].execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('❌ Hubo un error al ejecutar el comando.');
  }
});

client.login(process.env.DISCORD_TOKEN);
