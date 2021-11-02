const { Client,Intents } = require("discord.js");
const { token } = require("./config.json");
const { readdirSync } = require("fs");
const handler = require("../CommandHandler");

const client = new Client({ intents: [ Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
    ]});

const commandConfig = new handler.CommandConfig(
    client,
    "!",
    true,
    __dirname + "\\prefixes");

handler.setup(commandConfig);

client.on("ready", async () => {
    await handler.useSlashHandler();

    handler.useDefaultHelp(handler);

    for (const file of readdirSync(__dirname + "/Commands").filter(file => file.endsWith('.js'))) {
        const command = require(`./Commands/${file}`);
        handler.addCommand(command);

        if(command.slash) handler.addSlashCommand(command);
    }

    console.log("ready");
});

client.on("messageCreate", message => {
    handler.messageReceived(message);
});

handler.events.on("command_error", e => console.log(e))

handler.events.on("command_executed", async (command, client, message, args) => {
   await handler.executeCommand(command, client, message, args);
});

client.ws.on("INTERACTION_CREATE", async data => {
    handler.wsInteractionReceived(data);
});

client.login(token);