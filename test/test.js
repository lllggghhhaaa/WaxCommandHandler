const { Client } = require("discord.js");
const { token } = require("./config.json");
const { readdirSync } = require("fs");
const handler = require("../CommandHandler");

const client = new Client();

const commandConfig = new handler.CommandConfig(
    client,
    "!",
    true,
    "Wait %TIME% seconds to execute %CMD%",
    "You dont has permission `%PERM%` to execute this command",
    "The correct usage is `%USAGE%`");

handler.setup(commandConfig);

client.on("ready", () => {
    handler.useSlashHandler();

    handler.useDefaultHelp(handler);

    for (const file of readdirSync(__dirname + "/Commands").filter(file => file.endsWith('.js'))) {
        const command = require(`./Commands/${file}`);
        handler.addCommand(command);

        if(command.slash) handler.listSlashCommand(command);
    }
});

client.on("message", message => {
    handler.messageReceived(message);
});

client.ws.on("INTERACTION_CREATE", async data => {
    handler.wsInteractionReceived(data);
})

client.login(token);