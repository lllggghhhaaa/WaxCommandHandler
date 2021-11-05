module.exports = {
    name: "test2",
    description: "testing commands",
    aliases: [ "t2", "guei2" ],
    usage: "test <member|number>",
    cooldown: 5,
    permissions: [ "ADMINISTRATOR" ],
    async execute(client, message, args) {
        let member = args[0].value;

        if (args[0].type === "number")
            await message.guild.members.fetch(args[0].toString())
                .then(user => member = user);

        message.reply(member.user.username);
    },
};