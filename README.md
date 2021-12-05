### Como usar

#### Instalando
`npm i wax-command-handler`
#### Coloque no arquivo principal do bot
```js
const handler = require("wax-command-handler");
const { Client, Intents } = require("discord.js");

// Intents necessarios para eventos de mensagens
const client = new Client({intents: [ Intents.FLAGS.GUILD_MESSAGES ]});


// (client: Discord.Client, prefix: string, ignore_bot: boolean, path: string)
const commandConfig = new handler.CommandConfig(
    client, // client instance
    "!", // prefix
    true, // ignore bot messages
    __dirname + "\\prefixes" // prefix data path
);


// inicializa o handler
handler.setup(commandConfig);

client.on("ready", () => {
    // inicializar handler para slash
    handler.useSlashHandler();
    
    // registrando os comandos de uma pasta
    for (const file of readdirSync(__dirname + "/Commands").filter(file => file.endsWith('.js'))) {
        const command = require(`./Commands/${file}`);
        handler.addCommand(command);

        // registrar slash commands
        if(command.slash) handler.addSlashCommand(command);
    }

    console.log("ready");
});

client.login("token");
```

#### No evento "messageCreate" do client
```js
client.on("messageCreate", message => {
    // ...
    handler.messageReceived(message);
});
```
`nota: evento "message" deprecado`

#### Executando comandos
```js
handler.events.on("command_executed", async (command, client, message, args) => {
    // processe sua ceira
    
    await handler.executeCommand(command, client, message, args);
});
```

#### Recebendo erros
```js
handler.events.on("command_error", (e, command, client, message, args) => {
    console.log(e);
}); // evento emitido quando ocorre algum erro

handler.events.on("cooldown", (message, timeLeft) => {
    message.reply(`Aguarde ${timeLeft} segundos para executar esse comando novamente`);
}); // evento emitido quando o cooldown nao resetou

handler.events.on("no_perm", (message, permission) => {
    message.reply(`Voce nao tem a permissao ${permission} para executar este comando`);
}); // evento emitido quando o usuario nao tem permissao para executar o comando

handler.events.on("no_args", (message, command) => {
    message.reply("Uso correto: " + command.usage);
}); // evento emitido quando a quantidade de argumentos e menor do que o uso do comando

handler.events.on("invalid_args", (args, message, command) => {
    message.reply("Uso correto: " + command.usage);
}); // evento emitido quando o tipo do argumento e diferente do que o uso do comando
```

#### Se for usar slash commands
```js
client.ws.on("INTERACTION_CREATE", async data => {
    // processe sua ceira
    
    handler.wsInteractionReceived(data);
})
```

#### Exemplo de comando
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
    usage: "test <member|number>",
    cooldown: 5,
    permissions: [ "ADMINISTRATOR" ],
    async execute(client, message, args) {
        let member = args[0].value;

        if (args[0].type === "number")
            await message.guild.members.fetch(args[0].raw)
                .then(user => member = user);

        message.reply(member.user.username);
    },
};
```

#### Sobre os parametros dos comandos (usage)

Caso o comando seja executado de maneira correta, o evento **command_executed** será chamado, caso contrario, o evento **invalid_args** será chamado

Uso: `usage: "nome <tipo_argumento1> <tipo_argumento_2>"`

Operador `|` permite multiplos tipos

Ex:
`usage: "sum <number> <number>"`

Tipos

- "any" (ignora qualquer tipo, retorna string)
- "string" (permite que nao seja nenhum dos outros abaixo, retorna string)
- "number" (permite que seja apenas um numero, retorna BigInt)
- "member" (permite que seja apenas um membro em uma mencao <@id>, retorna GuildMember)
- "channel" (permite que seja apenas um canal em uma mencao <#id>, retorna TextChannel)
- "role" (permite que seja apenas um cargo em uma mencao <@&id>, retorna Role)

```js
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

#### Tipos de parametros
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

#### Sobre o prefix manager

```js
const prefixManager = client.prefixManager;

// Pega o prefixo registrado em um servidor (ou o padrão caso indefinido)
const prefix = prefixManager.getPrefix(guildId);

// Muda o prefixo de um servidor
prefixManager.setPrefix(guildId, prefix);

// Muda o prefixo padrão
prefixManager.setDefault(prefix);
```

#### Listar comandos

```js
let commands = handler.commands;

// slash command
client.handler.listSlashCommand();
```

### Links externos

[WaxCommandHandler](https://www.npmjs.com/package/wax-command-handler): Link do NPM do WaxCommandHandler <br/>
[Alonsal](https://github.com/brnd-21/Alonsal): Bot movido pelo WaxCommandHandler e muita ceira

<img src="assets/CeiraSolutions.png">