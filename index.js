require('dotenv').config();
const { TOKEN, TOKENC, dbTOKEN, TESTING } = process.env;
const { connect } = require('mongoose')
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
client.commandArray = []
client.buttons = new Collection()
client.selectMenus = new Collection()
client.pollTimeouts = {}
client.color = 'f88340' // use as default color
client.configCommands = [ // configurable commands to use in set up, with their database key
    { name: 'suggest', dataKey: 'suggestChannel' },
    { name: 'poll', dataKey: 'pollChannel' }
] 

const functionFolders = fs.readdirSync(`./functions`)
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./functions/${folder}`)
        .filter(file => file.endsWith('.js'));
    for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client)
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(TESTING == 'true' ? TOKENC : TOKEN);
(async () => {
    await connect(dbTOKEN).catch(console.error)
})();