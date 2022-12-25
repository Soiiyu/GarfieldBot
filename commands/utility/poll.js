const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const numEmote = ['1⃣', '2⃣', '3⃣', '4⃣']

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Make a poll!')
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription('The title of the poll')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("options")
                .setDescription('options seperated by (,) [minimum 2]')
                .setRequired(false)),
    async execute(interaction, client) {
        const title = interaction.options.getString('title')
        const options = interaction.options.getString('options')?.split(/\s*,\s*/).filter(w => w !== '')
        // const optionList = options ? options.split(/\s*,\s*/).filter(w => w !== '') : []

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(title)
            .setAuthor({
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })

        const actionRow = new ActionRowBuilder()

        const endPoll = new ButtonBuilder()
            .setCustomId('endpoll')
            .setEmoji('🛑')
            .setLabel('End Poll')
            .setStyle(ButtonStyle.Secondary);

        // actionRow.addComponents(endPoll)
        if (!options) {
            const upvote = new ButtonBuilder()
                .setCustomId('upvote')
                .setEmoji('⬆️')
                .setLabel('0')
                .setStyle(ButtonStyle.Success);
            const downvote = new ButtonBuilder()
                .setCustomId('downvote')
                .setEmoji('⬇️')
                .setLabel('0')
                .setStyle(ButtonStyle.Danger);

                actionRow.addComponents([upvote, downvote])
        } else if (options.length < 2) return await interaction.reply({ content: 'Please provide more options seperated by a (,)\nexample: `pizza, lasagna, orange juice`', ephemeral: true })
        else if (options.length >= 2 && options.length < 5) {
            options.forEach((option, i) => {
                const optionButton = new ButtonBuilder()
                    .setCustomId(`poll-vote_${i+1}`)
                    .setEmoji(numEmote[i])
                    .setLabel('0')
                    .setStyle(ButtonStyle.Primary)
                actionRow.addComponents(optionButton)
            })
            embed.setDescription(options.map((option, i) => `${i + 1}. ${option}`).join('\n'))
        } else {

        }

        await interaction.reply({ embeds: [embed], components: [actionRow, new ActionRowBuilder().addComponents(endPoll)]})
    }

}
