const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Detailed information about Garfield bot.'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`weee`)
        await interaction.reply({embeds: [embed]})
    }
}