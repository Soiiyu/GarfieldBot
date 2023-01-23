const Poll = require('../../schemas/polls')
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js')
const mongoose = require('mongoose')

const numEmote = ['1⃣', '2⃣', '3⃣', '4⃣']
const defaultTime = 2 * 24 * 60 * 60 * 1000 // 2 Days

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

        // Determine when the poll will end (plan to add user option to set manually)
        const endTime = Date.now() + defaultTime

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(title)
            .setAuthor({
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })
            .addFields([
                {
                    name: 'Ends in',
                    value: `<t:${Math.round(endTime / 1000)}:R>`,
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: 'Votes',
                    value: '0',
                    inline: true
                }
            ])

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
                // creating a numbered button for each option, with id <i>
                const optionButton = new ButtonBuilder()
                    .setCustomId(`poll-vote_${i}`)
                    .setEmoji(numEmote[i])
                    .setLabel('0')
                    .setStyle(ButtonStyle.Primary)
                actionRow.addComponents(optionButton)
                return `**${i + 1}.** ${option}`
            }).join('\n'))
        } else {
            // if there are more than 4 options, send a poll with a drop-down menu
            const selectMenu = new SelectMenuBuilder()
                .setCustomId('poll-menu')
                .setPlaceholder('Select an option...')
            embed.setDescription(options.map((option, i) => {
                selectMenu.addOptions({ label: `[0] - ${option}`, value: `` + i })
                return `**${i + 1}.** ${option}`
            }).join('\n'))
            actionRow.addComponents(selectMenu)
        }

        // After replying with the poll, using fetchReply, store the sent message id to the database
        await interaction.reply({ embeds: [embed], components: [actionRow, new ActionRowBuilder().addComponents(endPoll)], fetchReply: true })
            .then(async msg => {
                const pollData = new Poll({
                    _id: mongoose.Types.ObjectId(),
                    msgId: msg.id,
                    channelId: interaction.channel.id,
                    pollType: options ? (options.length < 5 ? 'buttons' : 'selectmenu') : 'yesno',
                    endTime,
                    votes: new Array(optionCount).fill(1).map(() => [])
                })
                await pollData.save().catch(console.error);
                console.log(`[Database] - New poll entry with ${optionCount} options for ${endTime - Date.now()}ms`)
                // Creating a timeout to end the poll
                client.pollTimeouts[pollData.msgId] = setTimeout(() => {
                    console.log('Poll ended after timeout')
                    client.endPoll(null, pollData)
                    delete client.pollTimeouts[pollData.msgId]
                }, endTime - Date.now())
            })
            .catch(console.error)
    }

}
