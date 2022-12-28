const Poll = require('../../schemas/polls')
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js')
const mongoose = require('mongoose')

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
                .setDescription('(optional) options seperated by (,) [minimum 2]')
                .setRequired(false)),
    async execute(interaction, client) {
        const title = interaction.options.getString('title')
        const options = interaction.options.getString('options')?.split(/\s*,\s*/).filter(w => w !== '')
        const optionCount = options ? options.length : 2

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(title)
            .setAuthor({
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })

        // Action row for voting buttons and drop-down menus to add to
        const actionRow = new ActionRowBuilder()

        const endPoll = new ButtonBuilder()
            .setCustomId(`endpoll_${interaction.user.id}`)
            .setEmoji('🛑')
            .setLabel('End Poll')
            .setStyle(ButtonStyle.Secondary);

        if (!options) {
            // if no options, send out a 'Yes No' poll
            // setting index 0 of database votes to yes, and 1 to no
            const upvote = new ButtonBuilder()
                .setCustomId('poll-yesno_0')
                .setEmoji('<:Yes:712682828302909481>')
                .setLabel('0')
                .setStyle(ButtonStyle.Success);
            const downvote = new ButtonBuilder()
                .setCustomId('poll-yesno_1')
                .setEmoji('<:No:712682828332138586>')
                .setLabel('0')
                .setStyle(ButtonStyle.Danger);

            actionRow.addComponents([upvote, downvote])
        } else if (options.length < 2) return await interaction.reply({ content: 'Please provide more options seperated by a (,)\nexample: `pizza, lasagna, orange juice`', ephemeral: true })
        else if (options.length >= 2 && options.length < 5) {
            // if there are 2-4 options, send a poll with numbered buttons
            embed.setDescription(options.map((option, i) => {
                // creating a numbered button for each option, with id <i + 1>
                const optionButton = new ButtonBuilder()
                    .setCustomId(`poll-vote_${i}`)
                    .setEmoji(numEmote[i])
                    .setLabel('0')
                    .setStyle(ButtonStyle.Primary)
                actionRow.addComponents(optionButton)
                return `${i + 1}. ${option}`
            }).join('\n'))
        } else {
            // if there are more than 4 options, send a poll with a drop-down menu
            const selectMenu = new SelectMenuBuilder()
                .setCustomId('poll-menu')
                .setPlaceholder('Select an option...')
            embed.setDescription(options.map((option, i) => {
                selectMenu.addOptions({ label: `[0] - ${option}`, value: `` + i })
                return `${i + 1}. ${option}`
            }).join('\n'))
            actionRow.addComponents(selectMenu)
        }
        console.log(actionRow.components.length)
        await interaction.reply({ embeds: [embed], components: [actionRow, new ActionRowBuilder().addComponents(endPoll)], fetchReply: true })
            .then(async msg => {
                const pollData = new Poll({
                    _id: mongoose.Types.ObjectId(),
                    msgId: msg.id,
                    pollType: options ? (options.length < 5 ? 'buttons' : 'selectmenu') : 'yesno',
                    votes: new Array(optionCount).fill(1).map(() => [])
                })
                await pollData.save().catch(console.error);
                console.log(`[Database] - New poll entry with ${optionCount} options`)
            })
            .catch(console.error)
    }

}
