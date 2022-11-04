const { SlashCommandBuilder } = require('discord.js')
const slaps = require('./slaps.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap someone!'),
    async execute(interaction, client) {
        let randomSlap = slaps[Math.floor(Math.random() * slaps.length)]
        await interaction.reply({content: randomSlap})
    }
}