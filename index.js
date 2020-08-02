require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
  bot.commands.set(botCommands[key].name, botCommands[key]);
});

const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`=======================================`);
  console.info(`Logged in as ${bot.user.tag}!`);
  console.info(`======================================= \n \n`);
});

bot.on('message', msg => {
  //ignore self message
  if(msg.author.bot) return;
  console.info(`----------------- < on message event > -------------------`);
  console.info(`msg author: ${msg.author.tag}`);

  //check if prefix exit
  if(msg.toString().charAt(0) != '!') { console.info(`----------------- </ on message event > -------------------`); return;}

  //args -> command | command -> text after args
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase(); //.shift() for removing the command part of the msg
  console.info(`Called command: ${command} `);

  if (!bot.commands.has(command)) {
    console.info(`can't find command : ${command} \n`);
    console.info(`----------------- </ on message event > ------------------- \n`);
    return;
  } 

  try {
    console.info(`try to find ${command} function to exec`); //find command in commands/index.js and exec it
    bot.commands.get(command).execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!');
  }
  console.info(`----------------- </ on message event > ------------------- \n`);
});

bot.on('messageReactionAdd', (re,user) => {
  console.info(`----------------- < on messageReactionAdd event > -------------------`);

  if(re.users.bot) return;

  try {
    bot.commands.get('add').execute(bot,re, user);
  } catch (error) {
    console.error(error);
  }
  console.info(`----------------- </ on messageReactionAdd event > -------------------\n `);
});