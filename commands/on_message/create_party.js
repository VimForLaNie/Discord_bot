const { randomBytes } = require('crypto');
adconst Discord = require('discord.js');
const format = require('biguint-format');
const PARTYEMBED = JSON.parse(process.env.PARTYEMBED);
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.URI;
const client = new MongoClient(uri, { useNewUrlParser: true });

module.exports = {
    name: 'pcreate',
    description: 'create a new party',
    execute(msg, args) {
      let msg_author = msg.author;
      const party_name = args[1]; //!pcreate <num> <name>
      //create party obj with 6-byte hex id
      var rand_id_str = randomBytes(3).toString('hex');
      var rand_id_val = format(randomBytes(3),'dec');
      var party = { id : rand_id_str , Name : party_name ,leader : msg_author.id, members : [] }; //member array for easy joining
      client.connect((err,db) => {
        if(err) throw err;
        var dbo = db.db("party"); //db call party
        //insert party-obj
        dbo.collection("partyList").insertOne(party , (err,res) =>{ //insert party obj
          if(err) throw err;
          console.info(`party inserted`);
        });
      });
      //party embed modify
      PARTYEMBED.embed.title = party_name.toString();
      PARTYEMBED.embed.color = rand_id_val;
      PARTYEMBED.embed.thumbnail = { "url" : msg_author.avatarURL.toString()};
      //output msg for joining via reaction button
      msg.channel.send(PARTYEMBED).then( em => {
        em.react('🚪');
      });
    },
  };