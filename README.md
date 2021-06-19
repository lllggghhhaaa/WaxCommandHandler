### Como usar

#### Instalando
`npm i wax-command-handler`

#### coloque no arquivo principal do bot
```js
const handler = require("wax-command-handler");
const discord = require("discord.js");

const client = new discord.Client();


// (client: Discord.Client, prefix: string, ignore_bot: boolean, cooldown_message: string, permission_message: string)
const commandConfig = new handler.CommandConfig(
    client, 
    "!",
    true,
    "Wait %TIME% seconds to execute %CMD%",
    "You dont has permission %PERM% to execute this command");


handler.setup(commandConfig);


// to use default help
handler.useDefaultHelp(handler);


for (const file of readdirSync(__dirname + "/commands").filter(file => file.endsWith('.js'))) {
    const command = require(`./commands/${file}`);
    handler.addCommand(command);
}

client.login("token");
```

#### no evento "message" do client
```js
client.on("message", message => {
    // ...
    handler.messageReceived(message);
});
```

#### exemplo de comando
```js
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
```

#### listar comandos

```js
// from handler
let commands = handler.commands;

// from client
let commands = client.handler.commands;
```