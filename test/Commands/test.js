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
    slash_params: [{
        name: "texto",
        description: "texto retornativo",
        type: 3,
        required: true
    }],
    slash(client, handler, data, params) {
        const texto = params.get("texto");
        handler.postSlashMessage(data, "it's work, it's magic!" + " `" + texto + "`");
    }
};