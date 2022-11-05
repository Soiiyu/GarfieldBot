const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Make a poll!')
        .addStringOption(option => 
            option
                .setName("title")
                .setDescription('The title of the poll')
                .setRequired(true)),
    async execute(interaction, client) {
        const desc = interaction.options.getString("title")
        console.log(desc)
        const embed = new EmbedBuilder()
            .setImage('https://i.imgur.com/Cax8Kw2.png')
            .setColor(client.color)
            .setDescription(desc)
        await interaction.reply({embeds: [embed]})
    }
    
}
