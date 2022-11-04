const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const kicks = require('./kicks.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick someone! (not actuall kick)')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user to kick')
                .setRequired(true)),
    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const randomKick = kicks[Math.floor(Math.random() * kicks.length)]
        const embed = new EmbedBuilder()
            .setImage(randomKick)
            .setColor(client.color)
            .setDescription(`${interaction.user} kicked ${user}!`)
        await interaction.reply({embeds: [embed]})
    }
}