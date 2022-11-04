const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const fs = require('fs')

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync('./commands')
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./commands/${folder}`)
                .filter(file => file.endsWith('.js'))

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`Command: ${command.data.name} has been loaded`);
            }
        }

        const clientId = '738053031605698661';
        const rest = new REST({version: '9'}).setToken(process.env.TOKEN);
        try {
            console.log('Started refreshin application (/) commands.');
            
            await rest.put(Routes.applicationCommands(clientId), {
                body: client.commandArray
            });
        } catch(error) {
            console.error(error);
        }
    }
}