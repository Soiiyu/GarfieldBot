const Guild = require('../../schemas/guild')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Send a suggestion to the server.')
        .addStringOption(option =>
            option
                .setName('suggestion')
                .setDescription('What is your suggestion?')
                .setRequired(true)),
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        const suggestion = interaction.options.getString('suggestion');

        if (!guildProfile) await interaction.reply('This server has not set up a suggestion room.')
        else {
            const embed = new EmbedBuilder()
                .setAuthor({
                    iconURL: interaction.user.displayAvatarURL(),
                    name: interaction.user.tag
                })
                .setTitle('Suggestion')
                .setColor(client.color)
                .setDescription(suggestion)
                const channel = client.channels.cache.get(guildProfile.suggestChannel)
                await interaction.reply({ content: `Sent your suggestion to ${channel}`, ephemeral: true })
                await channel.send({ embeds: [embed] })
        }


    }
}