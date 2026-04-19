const profileManager = require('../managers/profileManager');

module.exports = {
  name: 'pay',
  async execute(message, args) {
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target || isNaN(amount) || amount <= 0) {
      return message.reply('❌ **Uso:** `+pay @usuario <cantidad>`');
    }

    if (target.id === message.author.id) {
      return message.reply('❌ **No puedes enviarte dinero a ti mismo.**');
    }

    const senderId = message.author.id;
    let sender = profileManager.getProfile(senderId);
    if (!sender) sender = profileManager.createProfile(senderId, message.author.username);

    if ((sender.dinero || 0) < amount) {
      return message.reply(`❌ **No tienes suficiente dinero.** Tienes **${sender.dinero || 0} ryos**.`);
    }

    let receiver = profileManager.getProfile(target.id);
    if (!receiver) receiver = profileManager.createProfile(target.id, target.username);

    profileManager.addDinero(senderId, -amount);
    profileManager.addDinero(target.id, amount);

    message.reply(`✅ **Enviaste ${amount} ryos** a ${target}. Tu nuevo balance: **${(sender.dinero || 0) - amount} ryos**.`);
  }
};
