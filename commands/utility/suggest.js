const Guild = require('../../schemas/guild')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
        const guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        const suggestion = interaction.options.getString('suggestion');
        const attachment = interaction.options.getAttachment('image')

        // If the server set up a suggest room set it to the specified channel
        // if not, tell the user and stop
        if (guildProfile && guildProfile.suggestChannel) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    iconURL: interaction.user.displayAvatarURL(),
                    name: interaction.user.tag
                })
                .setTitle('Suggestion')
                .setColor(client.color)
                .setDescription(suggestion)
            if (attachment && attachment.contentType.includes('image')) embed.setImage(attachment.url)

            // Fetch the suggestion channel for the server and send the suggestion there
            // If the command is sent in the guildProfile.suggestChannel, no need to fetch it and informing the user it was sent
            const channel = guildProfile.suggestChannel != interaction.channel.id ?
                client.channels.cache.get(guildProfile.suggestChannel) :
                null

            if (channel) {
                await interaction.reply({ content: `Sent your suggestion to ${channel}`, ephemeral: true })
                await channel.send({ embeds: [embed] })
            } else {
                await interaction.reply({ embed: [embed] })
            }

        } else await interaction.reply({ content: 'This server has not set up a suggestion room.', ephemeral: true })
    }
}