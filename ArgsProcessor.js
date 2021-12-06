const { MessageMentions: { USERS_PATTERN, CHANNELS_PATTERN, ROLES_PATTERN } } = require('discord.js');

const types = {
    ANY: "any",
    MEMBER: "member",
    CHANNEL: "channel",
    ROLE: "role",
    NUMBER: "number",
    STRING: "string"
}

module.exports.process = (client, message, args) => {
    const p_args = [];
    p_args.join = args.join;

    args.forEach((value) => {
        const arg_obj = new Argument(value);

        if (value.match(USERS_PATTERN)) {
            arg_obj.type = types.MEMBER;

            let id = value.slice(2, -1);

            if (id.startsWith('!'))
                id = id.slice(1);

            arg_obj.value = message.guild.members.cache.get(id);
        } else if (value.match(CHANNELS_PATTERN)) {
            arg_obj.type = types.CHANNEL;

            const id = value.slice(2, -1);
            arg_obj.value = client.channels.cache.get(id);
        } else if (value.match(ROLES_PATTERN)) {
            arg_obj.type = types.ROLE;

            const id = value.slice(3, -1);
            arg_obj.value = message.guild.roles.cache.get(id);
        } else if (!isNaN(value)) {
            arg_obj.type = types.NUMBER;
            arg_obj.value = BigInt(value);
        } else {
            arg_obj.type = types.STRING
        }

        p_args.push(arg_obj)
    });

    return p_args;
};

module.exports.types = types;

class Argument extends String {
    constructor(props) {
        super(props);
        this.raw = props;
    }

    type;
    value;
}