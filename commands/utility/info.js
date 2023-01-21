const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Detailed information about Garfield bot.'),
    async execute(interaction, client) {
        const main = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail("https://i.imgur.com/EKmNSiO.png")
            .setTitle("Hello there! 👋")
            .setDescription([
                "I'm Garfield, the lazy orange cat that eats lasagna.",
                "I have a bunch of commands that you can explore in the following list.",
            ].join("\n"))
            .setFields(
                {
                    name: "Useful links:",
                    value: "[Website](https://garifled.alux.wtf)",
                    inline: true
                },
                {
                    name: "\u200b",
                    value: "[Invite me](https://invite.alux.wtf)",
                    inline: true
                },
                {
                    name: "\u200b",
                    value: "[Support server](https://server.alux.wtf)",
                    inline: true
                },
            )
        
        const commands = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Command list 😺")
            .setDescription([
                "I'm Garfield, the lazy orange cat that eats lasagna.",
                "I have a bunch of commands that you can explore in the following list."
            ].join("\n"))
        
        await interaction.reply({embeds: [main, commands], ephemeral: true})
    }
}