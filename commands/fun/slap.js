const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const slaps = require('./slaps.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap someone!')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user to slap')
                .setRequired(true)),
    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const randomSlap = slaps[Math.floor(Math.random() * slaps.length)]
        const embed = new EmbedBuilder()
            .setImage(randomSlap)
            .setColor(client.color)
            .setDescription(`${interaction.user} slapped ${user}!`)
        await interaction.reply({embeds: [embed]})
    }
}