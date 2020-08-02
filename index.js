//get all the lib and const and package and everything
require('dotenv').config();
const Discord = require('discord.js');
const { PREFIX } = require('./config.json');
const botCommands = require('./commands');

//important global var
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const TOKEN = process.env.TOKEN;

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

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`=======================================`);
  console.info(`Logged in as ${bot.user.tag}!`);
  console.info(`======================================= \n \n`);
});

//message event
bot.on('message', msg => {
  //ignore self message
  if(msg.author.bot) return;
  console.info(`----------------- < on message event > -------------------`);
  //check if prefix exit
  if(!msg.content.toString().startsWith(PREFIX)) { console.info(`----------------- </ on message event > ---no--prefix---------`); return;}
  console.info(`msg author: ${msg.author.tag}`);
  //command -> command | args -> text after command
  const args = msg.content.split(/ +/);
  const command = args.shift().toLowerCase().substring(1); //.shift() for removing the command part of the msg | substr for remove prefix 
  console.info(`Called command: ${command} `);

  if (!bot.commands.has(command)) { //if bot doesn't have command
    console.info(`can't find command : ${command}`);
    console.info(`----------------- </ on message event > ----no-command-------- \n`);
    return;
  } 

  try { //find command in commands/index.js and exec it
    bot.commands.get(command).execute(msg, args,bot);
  } catch (error) {
    console.error(error);
    msg.reply('there was an error trying to execute that command!'); //output debug
  }
  console.info(`----------------- </ on message event > ----------err------- \n`);
});

//add reaction event
bot.on('messageReactionAdd', (re,user) => {
  console.info(`----------------- < on messageReactionAdd event > -------------------`);

  //ignore bot's reaction
  if(re.users.bot) return;
  //temporary hard-code command | will be based on emoji later
  const command = 'join';
  console.info(`command : ${command}`);

  if (!bot.commands.has(command)) { //if bot doesn't have command
    console.info(`can't find command : ${command}`);
    console.info(`----------------- </ on messageReactionAdd event > -------no-command----------- \n`);
    return;
  } 

  try { //try to find the command and exec it
    bot.commands.get(command).execute(re,user);
  } catch (error) {
    console.error(error);
  }
  console.info(`----------------- </ on messageReactionAdd event > ------err------------\n `);
});