module.exports = {
    name: "test2",
    description: "testing commands",
    aliases: [ "t2", "guei2" ],
    usage: "test <number>",
    cooldown: 5,
    permissions: [ "ADMINISTRATOR" ],
    async execute(client, message, args) {
        const ceira =
            `object: ${args[0]}\n` +
            `value: ${args[0].value}\n` +
            `type: ${args[0].type}\n`

        message.reply(ceira);
    },
};