const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const hugs = require('./hugs.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Hug someone!')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user to hug')
                .setRequired(true)),
    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const randomHug = hugs[Math.floor(Math.random() * hugs.length)]
        const embed = new EmbedBuilder()
            .setImage(randomHug)
            .setColor(client.color)
            .setDescription(`${interaction.user} hugged ${user}!`)
        await interaction.reply({embeds: [embed]})
    }
}