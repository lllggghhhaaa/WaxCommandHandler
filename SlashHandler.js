const { Collection } = require("discord.js");

let discord_client;
let handler;

module.exports.setupSlash = (client, command_handler) => {
    discord_client = client;
    handler = command_handler;
    handler.slashCommands = new Collection();
}

const get_application = (guild_id) => {
    const app = discord_client.api.applications(discord_client.user.id);

    return app;
}

module.exports.getApplication = get_application;

module.exports.addSlashCommand = (command, guildId) => {

    let app = get_application()

    app.commands.post({
        data: {
            name: command.name,
            description: command.description
        }});

    handler.slashCommands.set(command.name, command);

    console.log("added")
}

module.exports.onInteraction = (data) => {
    const command = handler.slashCommands.get(data.data.name);

    command.slash(discord_client, this, data);
}

function postSlashMessage(data, message) {
    discord_client.api.interactions(data.id, data.token).callback.post({
        data: {
            type: 4,
            data: {
                content: message
            }
        }
    })
}

module.exports.postSlashMessage = postSlashMessage;