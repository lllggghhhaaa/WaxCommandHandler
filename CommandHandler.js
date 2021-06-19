const { Collection } = require("discord.js");

let commandConfig;

const commands = new Collection();
const cooldowns = new Collection();

module.exports.setup = (cmdConfig) => {
    commandConfig = cmdConfig;
}

module.exports.addCommand = (command) => {
    commands.set(command.name, command);
}

module.exports.messageReceived = (client, message) => {
    if (commandConfig.ignore_bot && message.author.bot) return;
    if (!message.content.startsWith(commandConfig.prefix)) return;


    const args = message.content.slice(commandConfig.prefix.length).trim().split(/ +/);
    const command_name = args.shift().toLowerCase();

    try {
        const command = commands.get(command_name)
            || commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));

        if (!command) return;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        if (command.permissions) {
            const member_perms = message.channel.permissionsFor(message.author);
            if (!member_perms.has(command.permissions)) {
                return message.reply(commandConfig.permission_message.replace("%PERM%",
                    command.permissions.find(x => !member_perms.has(x))));
            }
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) * 0.001;
                return message.reply(commandConfig.cooldown_message
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

class CommandHandlerConfiguration {
    constructor(prefix, ignore_bot, cooldown_message, permission_message) {
        this.prefix = prefix;
        this.ignore_bot = ignore_bot;
        this.cooldown_message = cooldown_message;
        this.permission_message = permission_message;
    }
}

module.exports.CommandConfig = CommandHandlerConfiguration;