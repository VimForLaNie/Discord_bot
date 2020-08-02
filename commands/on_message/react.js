module.exports = {
    name: '',
    description: 'add reaction to message',
    execute(msg, emoji) {
      msg.react(emoji);
    },
  };