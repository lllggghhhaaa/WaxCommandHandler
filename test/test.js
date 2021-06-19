const { Client } = require("discord.js");
const { token } = require("./config.json");
const { readdirSync } = require("fs");
const handler = require("../CommandHandler");

const client = new Client();
handler.setup("ceira!", true, "Wait %TIME% seconds to execute %CMD%");

for (const file of readdirSync(__dirname + "/Commands").filter(file => file.endsWith('.js'))) {
    const command = require(`./Commands/${file}`);
    handler.addCommand(command);
}

client.on("message", message => {
    handler.messageReceived(client, message);
});

client.login(token);