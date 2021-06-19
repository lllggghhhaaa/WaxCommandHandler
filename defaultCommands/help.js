const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    description: "list all commands",
    aliases: [ "h", "ajuda" ],
    usage: "help",
    permissions: [ ],
    cooldown: 5,
    execute(client, message, args) {
        if (args[0]) {
            let command = client.handler.commands.find(cmd => cmd.name === args[0]);

            if (!command) return message.reply("Cannot find this command");

            const embed = new MessageEmbed()
                .setTitle("Help")
                .setDescription(`**Name:** ${command.name}\n**Description:** ${command.description}\n**Aliases:** ${command.aliases.join(", ")}\n**Usage:** ${command.usage}\n**Cooldown:** ${command.cooldown}`);

            return message.channel.send(embed);
        }

        const embed = new MessageEmbed()
            .setTitle("Help")
            .setDescription(`Commands:\n ${client.handler.commands.map(command => command.name).join(`\`\n\``)}`);

        message.channel.send(embed);
    },
};