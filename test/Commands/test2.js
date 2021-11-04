module.exports = {
    name: "test2",
    description: "testing commands",
    aliases: [ "t2", "guei2" ],
    usage: "test <any> <member>",
    cooldown: 5,
    permissions: [ "ADMINISTRATOR" ],
    execute(client, message, args) {
        message.channel.send(args[0]);
    },
};