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
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName("time")
                .setDescription('(optional) time until the poll ends (5m | 2h | 4d | 1w) [maximum 1 week]')
                .setRequired(false)),
    async execute(interaction, client) {
        const title = interaction.options.getString('title')
        const options = interaction.options.getString('options')?.split(/\s*,\s*/).filter(w => w !== '')
        const optionCount = options ? options.length : 2

        // Determine when the poll will end
        const time = interaction.options.getString('time')
        let endTime = defaultTime
        // if user specifed time try parsing it and setting endTime as their choice
        // if it's bigger than a week or an invalid time, let the user know
        // if no time is specified use defaultTime
        if (time) {
            const userTime = parseTime(time)
            if (!userTime || userTime > 60000 * 60 * 24 * 7) return await interaction.reply({
                content: userTime ? `Your time is bigger than a week (<t:${Math.round((Date.now() + userTime) / 1000)}:R>), Try something shorter.\nexample: \`5d, 30m, 1.5h, 1w\``
                    : 'Failed to parse your time. please try again\nexample: \`5d, 30m, 1.5h, 1w\`',
                ephemeral: true
            })
            endTime = userTime
        }
        endTime += Date.now()

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
        else if (options.length > 25) return await interaction.reply({ content: 'Too many options, please use less than 25.', ephemeral: true })
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
                client.pollTimeouts[pollData.msgId] = setTimeout(async () => {
                    console.log('Poll ended after timeout')
                    // Fetching the poll with updated votes
                    const poll = await Poll.findOne({ msgId: msg.id });
                    client.endPoll(null, poll)
                    delete client.pollTimeouts[poll.msgId]
                }, endTime - Date.now())
            })
            .catch(console.error)
    }

}

function parseTime(time) {
    // Matching time for every time a number or float is followed by m, h, d or w.
    const matches = time.toLowerCase().match(/\d+(\.\d+)?[mhdw]/g)
    if (matches) {
        const timeTable = {
            m: 60000,
            h: 60000 * 60,
            d: 60000 * 60 * 24,
            w: 60000 * 60 * 24 * 7
        }
        // for each match, split the time and type (m, h, d, w) and multiply the time accordingly to get the time in ms
        const totalTime = matches.reduce((total, time) => {
            const num = parseFloat(time.slice(0, -1))
            const type = timeTable[time.slice(-1)]
            return total + num * type
        }, 0)
        return totalTime
    } else return null
}