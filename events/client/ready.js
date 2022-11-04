const { ActivityType } = require('discord.js');
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready as ${client.user.tag} 🐈`)

        client.user.setActivity('to MeowRemix.wav', { type: ActivityType.Listening })
    }
}