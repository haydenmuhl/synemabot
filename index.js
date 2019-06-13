// Requirements
require('dotenv').config();
const TwitchJs = require('twitch-js').default;

const commands = require('./src/commands');

// Twitch login deets
const login = {
  clientId: process.env.CLIENT_ID,
  token: process.env.OAUTH_TOKEN,
  username: process.env.BOT_USERNAME,
};
const targetChannel = process.env.CHANNEL_NAME;

console.log(TwitchJs);
const client = new TwitchJs(login);
const { chat } = client;

// When a message comes in...
function onChatHandler(input) {
  console.log(input);

  // Remove leading and trailing whitespace
  const message = input.message.trim();

  // Is the message a command?
  if (message[0] === '!') {
    const [commandName, ...args] = message.substring(1).split(' ');
    const commandHandler = commands[commandName];
    if (commandHandler) {
      commandHandler(client, input, ...args);
    } else {
      console.log('No such command: ' + commandName);
    }
  }
}

chat.on('PRIVMSG', onChatHandler);

// Connect to Twitch
async function connect() {
  await chat.connect();
  console.log('We connected to a thing.');
  await chat.join(targetChannel);
  console.log('We joined a thing.');
}

connect();
