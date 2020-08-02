module.exports = {
    name : 'play',
    description : 'play music (audio only) from yt',
    execute(msg,args,bot){
        const user_status = msg.member.voiceChannel; //get user status : undefined if !in vc
        if(user_status === undefined) { msg.reply("You have to be in a voice channel. . ."); return;} //throw err if !in vc
        let connection = msg.member.voiceChannel.join();//join vc
    },
};