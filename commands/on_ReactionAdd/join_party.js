const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@partylist.aorpn.gcp.mongodb.net/partylist?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

module.exports = {
    name: 'join',
    description: 'join a party',
    execute(re, user) {
      const party_id = re.message.toString().split(" "); //get party_id
      const query_item = { id : party_id[4].toString() }; //search by id
      client.connect((err,db) => {
        if(err) throw err;
        var dbo = db.db("party");
        //insert party-obj
        dbo.collection("partyList").find(query_item).toArray( (err,res) => { 
            if(err) throw err;
            console.log(res);
            if(user.id.toString() == res.leader.toString()) return; //if member == leader -> return
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