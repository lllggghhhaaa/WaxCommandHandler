const { Collection } = require("discord.js");

let discord_client;
let handler;

module.exports.setupSlash = (client, command_handler) => {
    discord_client = client;
    handler = command_handler;
    handler.slashCommands = new Collection();
}

const get_application = (guild_id) => {
    return discord_client.api.applications(discord_client.user.id);
}

module.exports.getApplication = get_application;

function listSlashCommand (command) {
    handler.slashCommands.set(command.name, command);
}

module.exports.listSlashCommand = listSlashCommand;

module.exports.addSlashCommand = (command, options) => {

    get_application().commands.post({
        data: {
            name: command.name,
            description: command.description,
            options: options
        }});

    listSlashCommand(command);
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
    });
}

module.exports.postSlashMessage = postSlashMessage;