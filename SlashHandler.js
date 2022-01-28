const fetch = require('node-fetch');
const { Collection } = require("discord.js");

// global var

let commands;
let discord_client;
let handler;

function listSlashCommand () {
    return fetch(`https://discord.com/api/v9/applications/${discord_client.user.id}/commands`, {
        headers: {
            "Authorization": "Bot " + discord_client.token
        }
    }).then(response => response.text());
}

function get_application() {
    return discord_client.api.applications(discord_client.user.id);
}

module.exports.postSlashMessage = (data, message) => {
    discord_client.api.interactions(data.id, data.token).callback.post({
        data: {
            type: 4,
            data: {
                content: message
            }
        }
    });
}

function deleteCommand(id) {
    fetch(`https://discord.com/api/v9/applications/${discord_client.user.id}/commands/${id}`, {
        headers: {
            "Authorization": "Bot " + discord_client.token
        },
        method: "DELETE"
    })
}

module.exports = {
    listSlashCommand,
    deleteCommand
}

module.exports.setupSlash = async (client, command_handler) => {
    discord_client = client;
    handler = command_handler;
    handler.slashCommands = new Collection();

    await Promise.resolve(listSlashCommand().then(data => {
        commands = JSON.parse(data);
    }));
}

module.exports.addSlashCommand = (command) => {

    if (!commands.some(cmd => cmd.name === command.name)) {
        get_application().commands.post({
            data: {
                name: command.name,
                description: command.description,
                options: command.slash_params
            }
        });
    }

    handler.slashCommands.set(command.name, command);
}

module.exports.onInteraction = (data) => {
    const command = handler.slashCommands.get(data.data.name);

    const params = new Map();

    if (typeof data.data.options != "undefined") {
        data.data.options.forEach(option => {
            params.set(option.name, option.value);
        });
    }

    command.slash(discord_client, this, data, params);
}

module.exports.deleteALlCommands = () => {
    commands.forEach((command) =>
        deleteCommand(command.id))
}