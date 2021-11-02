### Como usar

#### Instalando
`npm i wax-command-handler`

#### coloque no arquivo principal do bot
```js
const handler = require("wax-command-handler");
const discord = require("discord.js");

const client = new discord.Client();


// (client: Discord.Client, prefix: string, ignore_bot: boolean, path: string)
const commandConfig = new handler.CommandConfig(
    client, // client instance
    "!", // prefix
    true, // ignore bot messages
    __dirname + "\\prefixes" // prefix data path
);


handler.setup(commandConfig);

client.on("ready", () => {
    // to use default help
    handler.useSlashHandler();

    // to use slash commands
    handler.useDefaultHelp(handler);
    
    for (const file of readdirSync(__dirname + "/Commands").filter(file => file.endsWith('.js'))) {
        const command = require(`./Commands/${file}`);
        handler.addCommand(command);

        // to register slash command
        if(command.slash) handler.addSlashCommand(command);
    }

    console.log("ready");
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

#### executando comandos
```js
handler.events.on("command_executed", async (command, client, message, args) => {
    // ...
    await handler.executeCommand(command, client, message, args);
});
```

#### recebendo erros
```js
handler.events.on("command_error", e => {
    console.log(e);
}) // erros nos comandos

handler.events.on("cooldown", (message, timeLeft) => {
    message.reply(`Aguarde ${timeLeft} segundos para executar esse comando novamente`);
}) // evento emitido quando o cooldown nao resetou

handler.events.on("no_perm", (message, permission) => {
    message.reply(`Voce nao tem a permissao ${permission} para executar este comando`);
})
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
```

#### tipos de parametros
<p>SUB_COMMAND: 1</p>
<p>SUB_COMMAND_GROUP: 2</p>
<p>STRING: 3</p>
<p>INTEGER: 4 (Any integer between -2^53 and 2^53)</p>
<p>BOOLEAN: 5</p>
<p>USER: 6</p>
<p>CHANNEL: 7 (Includes all channel types + categories)</p>
<p>ROLE: 8</p>
<p>MENTIONABLE: 9 (Includes users and roles)</p>
<p>NUMBER: 10 (Any double between -2^53 and 2^53)</p>

#### pegando o prefixo

```js
let prefix = client.prefixManager.getPrefix(guildId);
```

#### mudando prefixo

```js
client.prefixManager.setPrefix(guildId, prefix);
```

#### listar comandos

```js
// from handler
let commands = handler.commands;

// from client
let commands = client.handler.commands;

// slash command
client.handler.listSlashCommand();
```