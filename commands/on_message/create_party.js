const { randomBytes } = require('crypto');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@partylist.aorpn.gcp.mongodb.net/partylist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });


module.exports = {
    name: 'pcreate',
    description: 'create a new party',
    execute(msg, args) {
      const author = msg.author.id;
      const party_name = args[1]; //!pcreate <num> <name>
      //create party obj with 12-byte hex id
      var rand_id = randomBytes(12).toString('Hex');
      var party = { id : rand_id , Name : party_name ,leader : author, members : [] }; //member array for easy joining
      client.connect((err,db) => {
        if(err) throw err;
        var dbo = db.db("party"); //db call party
        //insert party-obj
        dbo.collection("partyList").insertOne(party , (err,res) =>{ //insert party obj
          if(err) throw err;
          console.info(`party inserted`);
        });
      });
      //output msg for joining via reaction button
      msg.reply(`Party Id : ${rand_id} \n Game : ${party_name} \n`); //
    },
  };