module.exports = {
    name: "test",
    description: "testing commands",
    aliases: [ "t", "guei" ],
    usage: "test",
    cooldown: 5,
    permissions: [ "ADMINISTRATOR" ],
    execute(client, message, args) {
        message.channel.send("it's work, it's magic!");
    },
    slash(client, handler, data) {
        handler.postSlashMessage(data, "it's work, it's magic!")
    }
};