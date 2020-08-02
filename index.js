require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const { PREFIX } = require('./config.json');
const botCommands = require('./commands');

//connect to DB
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@partylist.aorpn.gcp.mongodb.net/partylist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err,db) => {
  if(err) throw err;
  console.info(`Connected to DB!!`);
});


//map all functions to bot command
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
  //check if prefix exit
  if(!msg.content.toString().startsWith(PREFIX)) { console.info(`----------------- </ on message event > ---no--prefix---------`); return;}
  console.info(`msg author: ${msg.author.tag}`);
  //args -> command | command -> text after args
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase().substring(1); //.shift() for removing the command part of the msg
  console.info(`Called command: ${command} `);

  if (!bot.commands.has(command)) {
    console.info(`can't find command : ${command}`);
    console.info(`----------------- </ on message event > ----no-command-------- \n`);
    return;
  } 

  try {
    console.info(`try to find ${command} function to exec`); //find command in commands/index.js and exec it
    bot.commands.get(command).execute(msg, args,bot);
  } catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!');
  }
  console.info(`----------------- </ on message event > ----------err------- \n`);
});

bot.on('messageReactionAdd', (re,user) => {
  console.info(`----------------- < on messageReactionAdd event > -------------------`);

  if(re.users.bot) return;

  const command = 'join';
  console.info(`command : ${command}`);

  if (!bot.commands.has(command)) {
    console.info(`can't find command : ${command}`);
    console.info(`----------------- </ on messageReactionAdd event > -------no-command----------- \n`);
    return;
  } 

  try {
    bot.commands.get(command).execute(re,user);
  } catch (error) {
    console.error(error);
  }
  console.info(`----------------- </ on messageReactionAdd event > ------err------------\n `);
});