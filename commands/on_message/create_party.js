const { randomBytes } = require('crypto');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@partylist.aorpn.gcp.mongodb.net/partylist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });


module.exports = {
    name: '!pcreate',
    description: 'create a new party',
    execute(msg, args) {
      const author = msg.author.id;
      const party_game = args[1];
      console.info(`${args[0]} , ${args[1]}`);
      //create party obj with 12-byte hex id
      var rand_id = randomBytes(12).toString('Hex');
      var party = { id : rand_id , game : party_game , num_player : 1 ,leader : author, };
      client.connect((err,db) => {
        if(err) throw err;
        var dbo = db.db("party");
        //insert party-obj
        dbo.collection("partyList").insertOne(party , (err,res) =>{
          if(err) throw err;
          console.info(`party inserted`);
        });
      });
    },
  };