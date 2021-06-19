const { Collection } = require("discord.js");

let bot_prefix;
let user_only;
let cooldown_error_message;

const commands = new Collection();
const cooldowns = new Collection();

module.exports.setup = (prefix, ignore_bot, cooldown_message) => {
    bot_prefix = prefix;
    user_only = ignore_bot;
    cooldown_error_message = cooldown_message;
}

module.exports.addCommand = (command) => {
    commands.set(command.name, command);
}

module.exports.messageReceived = (client, message) => {
    if (user_only && message.author.bot) return;
    if (!message.content.startsWith(bot_prefix)) return;


    const args = message.content.slice(bot_prefix.length).trim().split(/ +/);
    const command_name = args.shift().toLowerCase();

    try {
        const command = commands.get(command_name)
            || commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) * 0.001;
                return message.reply(cooldown_error_message
                    .replace("%TIME%", timeLeft.toFixed(1))
                    .replace("%CMD%", command_name));
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        command.execute(client, message, args);
    } catch (e) {
        console.log(e);
    }
}