const SlashHandler = require("./SlashHandler");
const { Collection } = require("discord.js");
const { EventEmitter } = require("events");
const prefixManager = require("./PrefixMap");
const argsProcessor = require("./ArgsProcessor");

// global var

let commandConfig;

const commands = new Collection();
const cooldowns = new Collection();
const events = new EventEmitter();

process.on('unhandledRejection', error => events.emit("command_error", error));

class CommandConfig {
    constructor(client, prefix, ignore_bot, path) {
        this.client = client;
        this.prefix = prefix;
        this.ignore_bot = ignore_bot;
        this.path = path;
    }
}

class InvArgStruct {
    constructor(arg, index) {
        this.arg = arg;
        this.index = index;
    }
}

function setup(cmdConfig) {
    commandConfig = cmdConfig;
    commandConfig.client.handler = this;
    commandConfig.client.prefixManager = prefixManager;

    prefixManager.setPath(commandConfig.path);
    prefixManager.setDefault(commandConfig.prefix);
}

async function useSlashHandler() {
    await SlashHandler.setupSlash(commandConfig.client, this);
}

function addCommand(command) {
    if (commands.get(command.name)) throw new Error("Duplicate command error");
    commands.set(command.name, command);
}

// exporting modules

module.exports = {
    commands,
    events,
    setup,
    useSlashHandler,
    addCommand,
    CommandConfig,
    argsProcessor
}

module.exports.addSlashCommand = SlashHandler.addSlashCommand;
module.exports.listSlashCommand = SlashHandler.listSlashCommand;
module.exports.deleteSlashCommand = SlashHandler.deleteCommand;
module.exports.deleteAllSlashCommands = SlashHandler.deleteALlCommands;
module.exports.wsInteractionReceived = SlashHandler.onInteraction;

module.exports.messageReceived = (message) => {
    if (commandConfig.ignore_bot && message.author.bot) return;

    let prefix = prefixManager.getPrefix(message.guild.id);

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command_name = args.shift().toLowerCase();

    const p_args = argsProcessor.process(commandConfig.client, message, args);

    const command = commands.get(command_name)
        || commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name));

    if (!command) return;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    if (command.usage) {
        let need_args = command.usage.split(' ');
        if (p_args.length < need_args.length - 1) return events.emit("no_args", message, command);
        need_args.shift();

        for (let i = 0; i < need_args.length; i++) {
            let value = need_args[i].toLowerCase();

            if (value.startsWith("<") && value.endsWith(">")) {
                value = value.slice(1, -1);

                const supported_types = value.slice("|");

                if (value.includes(argsProcessor.types.ANY)) continue;

                if (!supported_types.includes(p_args[i].type)) return events.emit("invalid_args", new InvArgStruct(value, i), message, command);
            }
        }
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

    events.emit("command_executed", command, commandConfig.client, message, p_args);
}

module.exports.executeCommand = async (command, client, message, args) => {
    try {
        await command.execute(commandConfig.client, message, args);
    } catch (e) {
        events.emit("command_error", e);
    }
}