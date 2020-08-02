module.exports = {
  name: 'ping',
  description: 'Ping!',
  execute(msg, args) {
    msg.reply('ping');
    msg.channel.send('ping');
  },
};
