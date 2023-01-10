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
                .setRequired(true))
        .addAttachmentOption(option =>
            option
                .setName('image')
                .setDescription('Add an image with your suggestion')
                .setRequired(false)),
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        const suggestion = interaction.options.getString('suggestion');
        const attachment = interaction.options.getAttachment('image')

        if (!guildProfile) await interaction.reply({ content: 'This server has not set up a suggestion room.', ephemeral: true })
        else {
            const embed = new EmbedBuilder()
                .setAuthor({
                    iconURL: interaction.user.displayAvatarURL(),
                    name: interaction.user.tag
                })
                .setTitle('Suggestion')
                .setColor(client.color)
                .setDescription(suggestion)
            if(attachment && attachment.contentType.includes('image')) embed.setImage(attachment.url)

            // Fetch the suggestion channel for the server and send the suggestion there
            const channel = client.channels.cache.get(guildProfile.suggestChannel)
            await interaction.reply({ content: `Sent your suggestion to ${channel}`, ephemeral: true })
            await channel.send({ embeds: [embed] })
        }


    }
}