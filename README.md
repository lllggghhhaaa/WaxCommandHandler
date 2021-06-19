### Como usar

#### Instalando
`npm i wax-command-handler`

#### coloque no arquivo principal do bot
```js
const handler = require("wax-command-handler");
const discord = require("discord.js");

const client = new discord.Client();

// (prefix: string, ignore_bot: boolean, cooldown_message: string)
handler.setup("ceira!", true, "Wait %TIME% seconds to execute %CMD%");

for (const file of readdirSync(__dirname + "/commands").filter(file => file.endsWith('.js'))) {
    const command = require(`./Commands/${file}`);
    handler.addCommand(command);
}

client.login("token");
```

#### no evento "message" do client
```js
client.on("message", message => {
    // ...
    handler.messageReceived(client, message);
});
```

#### exemplo de comando
```js
module.exports = {
    name: 'test',
    aliases: [ "t", "guei" ],
    cooldown: 5,
    execute(client, message, args) {
        message.channel.send("it's work, it's magic!")
    },
};
```