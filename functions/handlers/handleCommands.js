require('dotenv').config();
const { TOKEN, TOKENC, CLIENT, CLIENTC, TESTING } = process.env
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require('fs')

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync('./commands')
        const { commands, commandArray } = client;
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./commands/${folder}`)
                .filter(file => file.endsWith('.js'))

            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`Command: ${command.data.name} has been loaded`);
            }
        }

        // Run Canary if testing mode is on
        const clientId = TESTING == 'true' ? CLIENTC : CLIENT
        const rest = new REST({version: '9'}).setToken(TESTING == 'true' ? TOKENC : TOKEN);
        try {
            console.log('Started refreshin application (/) commands.');
            
            await rest.put(Routes.applicationCommands(clientId), {
                body: client.commandArray
            });

            // await rest.delete(Routes.applicationCommand(clientId, '923648300312305705')) // old random command
            // await rest.delete(Routes.applicationCommand(clientId, '923644223536922644')) // old meow command

            // Appending command id's to commandArray
            const commands = await rest.get(Routes.applicationCommands(clientId))
            commands.forEach(({id, name}) => {
                commandArray.find(cmd => cmd.name == name).id = id
            })
            //console.log(client.commandArray)
        } catch(error) {
            console.error(error);
        }
    }
}