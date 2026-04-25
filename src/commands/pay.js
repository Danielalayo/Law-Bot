const profileManager = require('../managers/profileManager');

module.exports = {
  name: 'pay',
  async execute(message, args) {
    const target = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!target || isNaN(amount) || amount <= 0)
      return message.reply('❌ **Uso:** `+pay @usuario <cantidad>`');
    if (target.id === message.author.id)
      return message.reply('❌ **No puedes enviarte dinero a ti mismo.**');

    let sender = await profileManager.getProfile(message.author.id);
    if (!sender) sender = await profileManager.createProfile(message.author.id, message.author.username);

    if ((sender.dinero || 0) < amount)
      return message.reply(`❌ **No tienes suficiente dinero.** Tienes **${sender.dinero || 0} ryos**.`);

    let receiver = await profileManager.getProfile(target.id);
    if (!receiver) receiver = await profileManager.createProfile(target.id, target.username);

    await profileManager.addDinero(message.author.id, -amount);
    await profileManager.addDinero(target.id, amount);

    message.reply(`✅ **Enviaste ${amount} ryos** a ${target}. Tu nuevo balance: **${(sender.dinero || 0) - amount} ryos**.`);
  }
};
