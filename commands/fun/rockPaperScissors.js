const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const quotes = require("./rockPaperScissors.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rock-paper-scissors')
        .setDescription('Play Rock Paper Scissors against me.'),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Rock Paper Scissors")
            .setDescription(quotes[Math.floor(Math.random() * quotes.length)])

        const actionRow = new ActionRowBuilder()

        // Creating rock paper scissors buttons, and defining their own _rock _paper or _scissors ids
        const rockButton = new ButtonBuilder()
            .setCustomId(`rockpaperscissors_rock`)
            .setEmoji('✊')
            .setLabel('Rock')
            .setStyle(ButtonStyle.Primary);

        const paperButton = new ButtonBuilder()
            .setCustomId(`rockpaperscissors_paper`)
            .setEmoji('🖐')
            .setLabel('Paper')
            .setStyle(ButtonStyle.Primary);

        const scissorsButton = new ButtonBuilder()
            .setCustomId(`rockpaperscissors_scissors`)
            .setEmoji('✌')
            .setLabel('Scissors')
            .setStyle(ButtonStyle.Primary);

        actionRow.addComponents([rockButton, paperButton, scissorsButton])

        await interaction.reply({ embeds: [embed], components: [actionRow], ephemeral: true })
    }
}