module.exports = {
    name : 'play',
    description : 'play music (audio only) from yt',
    execute(msg,args,bot){
        const user_status = msg.member.voiceChannel;
        if(user_status === undefined) { msg.reply("You have to be in a voice channel. . ."); return;}
        console.log(msg.member.voiceChannel.toString());
        let connection = msg.member.voiceChannel.join();
    },
};