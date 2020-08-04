const MongoClient = require('mongodb').MongoClient;
const uri = process.env.URI;
const client = new MongoClient(uri, { useNewUrlParser: true });

module.exports = {
    name: '%F0%9F%9A%AA',
    description: 'join a party',
    execute(re, user) {
      if(re.message.content.split(" ").shift() != "Party") return;//if msg a party msg
      const party_id = re.message.embed.color.toString('hex');
      const query_item = { id : party_id }; //search by id
      client.connect((err,db) => {
        if(err) throw err;
        var dbo = db.db("party");
        //ignore bot's reaction
        if(re.message.author.id == user.id) return;
        //insert party-obj
        dbo.collection("partyList").find(query_item).toArray( (err,res) => { 
            if(err) throw err;
            if(user.id.toString() == res[0].leader.toString()) return; //if member == leader -> return
            var temp_obj = res[0].members;
            temp_obj.push(user.id.toString()); //create temp obj to be overwrite in member array
            var update_obj = { $set: {members : temp_obj} }
            dbo.collection("partyList").updateOne(query_item,update_obj, (err,res) => {
                if(err) throw err;
            });
        });
      });
    },
  };