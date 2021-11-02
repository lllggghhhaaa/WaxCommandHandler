module.exports = {
    name: "prefix",
    description: "testing commands",
    cooldown: 5,
    aliases: [ "setprefix" ],
    permissions: [  ],
    execute(client, message, args) {
        client.prefixManager.setPrefix(message.guild.id, args[0]);
        message.channel.send(args[0]);
    },
    slash(client, handler, data) {
        client.prefixManager.setPrefix(message.guild.id, args[0]);
        handler.postSlashMessage(data, args[0]);
    }
};