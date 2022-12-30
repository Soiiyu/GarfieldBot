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

        const clientId = '706484429232799817';
        const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
        try {
            console.log('Started refreshin application (/) commands.');
            
            await rest.put(Routes.applicationCommands(clientId), {
                body: client.commandArray
            });

            // Appending command id's to commandArray
            const commands = await rest.get(Routes.applicationCommands(clientId))
            commands.forEach(({id, name}) => {
                commandArray.find(cmd => cmd.name == name).id = id
            })
            console.log(client.commandArray)
        } catch(error) {
            console.error(error);
        }
    }
}