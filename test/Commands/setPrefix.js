module.exports = {
    name: "prefix",
    description: "testing commands",
    cooldown: 5,
    aliases: [ "setprefix" ],
    permissions: [  ],
    execute(client, message, args) {
        client.prefixManager.setPrefix(message.guild.id, args[0])
        message.channel.send(args[0]);
    },
    slash(client, handler, data) {
        handler.postSlashMessage(data, "it's work, it's magic!")
    }
};