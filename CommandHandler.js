const SlashHandler = require("./SlashHandler");
const { Collection } = require("discord.js");
const { EventEmitter } = require("events");
const prefixManager = require("./PrefixMap");

let commandConfig;

const commands = new Collection();
const cooldowns = new Collection();
const events = new EventEmitter();

module.exports = {
    commands,
    events
}

process.on('unhandledRejection', error => events.emit("command_error", error));

module.exports.setup = (cmdConfig) => {
    commandConfig = cmdConfig;
    commandConfig.client.handler = this;
    commandConfig.client.prefixManager = prefixManager;

    prefixManager.setPath(commandConfig.path);
    prefixManager.setDefault(commandConfig.prefix);
}

module.exports.useSlashHandler = async () => {
    await SlashHandler.setupSlash(commandConfig.client, this);
}

function addCommand(command) {
    if (commands.get(command.name)) throw new Error("Duplicate command error");
    commands.set(command.name, command);
}

module.exports.addSlashCommand = SlashHandler.addSlashCommand;
module.exports.listSlashCommand = SlashHandler.listSlashCommand;
module.exports.deleteSlashCommand = SlashHandler.deleteCommand;
module.exports.deleteAllSlashCommands = SlashHandler.deleteALlCommands;

module.exports.addCommand = addCommand;

module.exports.useDefaultHelp = () => {
    const helpCommand = require("./defaultCommands/help");
    addCommand(helpCommand);
}

module.exports.messageReceived = (message) => {
    if (commandConfig.ignore_bot && message.author.bot) return;

    let prefix = prefixManager.getPrefix(message.guild.id);

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command_name = args.shift().toLowerCase();

    const command = commands.get(command_name)
        || commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));

    if (!command) return;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    if (command.usage) {
        let need_args = command.usage.split(' ');

        if (args.length < need_args.length - 1) return events.emit("no_args", message, command);
    }

    if (command.permissions) {
        const member_perms = message.channel.permissionsFor(message.author);
        if (!member_perms.has(command.permissions))
            return events.emit("no_perm", message, command.permissions.find(x => !member_perms.has(x)));
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) * 0.001;
            return events.emit("cooldown", message, timeLeft);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    events.emit("command_executed", command, commandConfig.client, message, args);
}

module.exports.executeCommand = async (command, client, message, args) => {
    try {
        await command.execute(commandConfig.client, message, args);
    } catch (e) {
        events.emit("command_error", e);
    }
}

module.exports.wsInteractionReceived = SlashHandler.onInteraction;

class CommandHandlerConfiguration {
    constructor(client, prefix, ignore_bot, path) {
        this.client = client;
        this.prefix = prefix;
        this.ignore_bot = ignore_bot;
        this.path = path;
    }
}

module.exports.CommandConfig = CommandHandlerConfiguration;