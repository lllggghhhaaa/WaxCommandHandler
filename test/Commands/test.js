module.exports = {
    name: 'test',
    aliases: [ "t", "guei" ],
    permissions: [ "ADMINISTRATOR" ],
    cooldown: 5,
    execute(client, message, args) {
        message.channel.send("it's work, it's magic!")
    },
};