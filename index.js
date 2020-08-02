require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = process.env.TOKEN;
const MSG_AUTHOR = process.env.MSG_AUTHOR;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  console.info(`msg author: ${msg.author}`);

  //ignore self message
  if(message.author.bot) return;

  //args -> command | command -> text after args
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase(); //.shift() for removing the command part of the msg
  console.info(`Called command: ${command}`);

  if (!bot.commands.has(command)) {
    console.info(`can't find command : ${command}`);
    return;
  } 

  try {
    console.info(`try to find ${command} function to exec`); //find command in commands/index.js and exec it
    bot.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!');
  }
});
