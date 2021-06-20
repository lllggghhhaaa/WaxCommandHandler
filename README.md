### Como usar

#### Instalando
`npm i wax-command-handler`

#### coloque no arquivo principal do bot
```js
const handler = require("wax-command-handler");
const discord = require("discord.js");

const client = new discord.Client();


// (client: Discord.Client, prefix: string, ignore_bot: boolean, cooldown_message: string, permission_message: string, wrong_usage_message: string)
const commandConfig = new handler.CommandConfig(
    client,
    "!",
    true,
    "Wait %TIME% seconds to execute %CMD%",
    "You dont has permission `%PERM%` to execute this command",
    "The correct usage is `%USAGE%`");


handler.setup(commandConfig);

client.on("ready", () => {
    // to use default help
    handler.useSlashHandler();

    // to use slash commands
    handler.useDefaultHelp(handler);
    
    for (const file of readdirSync(__dirname + "/Commands").filter(file => file.endsWith('.js'))) {
        const command = require(`./Commands/${file}`);
        handler.addCommand(command);

        // TO REGISTER COMMAND
        if(command.slash) handler.addSlashCommand(command);
        
        // IF THE COMMAND IS REGISTERED USE THIS INSTEANDED
        if(command.slash) handler.listSlashCommand(command);
    }
});

client.login("token");
```

#### no evento "message" do client
```js
client.on("message", message => {
    // ...
    handler.messageReceived(message);
});
```

#### se for usar slash commands
```js
client.ws.on("INTERACTION_CREATE", async data => {
    // ...
    handler.wsInteractionReceived(data);
})
```

#### exemplo de comando
```js
// sem nenhum parametro

module.exports = {
    name: "test",
    description: "testing commands",
    aliases: [ "t", "guei" ],
    cooldown: 5,
    permissions: [ "ADMINISTRATOR" ],
    execute(client, message, args) {
        message.channel.send("it's work, it's magic!");
    },
};

// com parametros

module.exports = {
    name: "test2",
    description: "testing commands",
    aliases: [ "t2", "guei2" ],
    usage: "test <message>",
    cooldown: 5,
    permissions: [ "ADMINISTRATOR" ],
    execute(client, message, args) {
        message.channel.send(args[0]);
    },
};

// com slash commands

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
```

#### listar comandos

```js
// from handler
let commands = handler.commands;

// from client
let commands = client.handler.commands;
```