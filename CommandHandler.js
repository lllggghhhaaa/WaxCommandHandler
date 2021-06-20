const SlashHandler = require("./SlashHandler");
const { Collection } = require("discord.js");

let commandConfig;

const commands = new Collection();
const cooldowns = new Collection();

module.exports.commands = commands;

module.exports.setup = (cmdConfig) => {
    commandConfig = cmdConfig;
    commandConfig.client.handler = this;
}

module.exports.useSlashHandler = () => {
    SlashHandler.setupSlash(commandConfig.client, this);
}

function addCommand(command) {
    if (commands.get(command.name)) throw new Error("Duplicate command error");
    commands.set(command.name, command);
}

module.exports.addSlashCommand = SlashHandler.addSlashCommand;
module.exports.listSlashCommand = SlashHandler.listSlashCommand;

module.exports.addCommand = addCommand;

module.exports.useDefaultHelp = (handler) => {
    const helpCommand = require("./defaultCommands/help");
    addCommand(helpCommand);
}

module.exports.messageReceived = (message) => {
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

        if (command.usage) {
            let need_args = command.usage.split(' ');

            if (args.length < need_args.length - 1) return message.reply(commandConfig.wrong_usage.replace("%USAGE%", command.usage));
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

        command.execute(commandConfig.client, message, args);
    } catch (e) {
        console.log(e);
    }
}

module.exports.wsInteractionReceived = SlashHandler.onInteraction;

class CommandHandlerConfiguration {
    constructor(client, prefix, ignore_bot, cooldown_message, permission_message, wrong_usage) {
        this.client = client;
        this.prefix = prefix;
        this.ignore_bot = ignore_bot;
        this.cooldown_message = cooldown_message;
        this.permission_message = permission_message;
        this.wrong_usage = wrong_usage;
    }
}

module.exports.CommandConfig = CommandHandlerConfiguration;