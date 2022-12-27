const Poll = require('../../schemas/polls')

module.exports = {
    data: {
        name: 'endpoll'
    },
    async execute(interaction, client, id) {
        const pollData = await Poll.findOne({ msgId: interaction.message.id });
        if (!pollData) return await interaction.reply({ content: 'This poll has already ended.', ephemeral: true })
        if (interaction.user.id !== id) return await interaction.deferUpdate()

        const embed = interaction.message.embeds[0]
        const totalVotes = Math.max(1, pollData.votes.reduce((votes, curr) => votes + curr.length, 0))
        switch (pollData.pollType) {
            case 'yesno':
                const [yes, no] = pollData.votes
                embed.data.description = `${boldText(`<:Yes:712682828302909481> ${Math.round(100 * yes.length / totalVotes)}%`, yes.length > no.length)} - ${boldText(`<:No:712682828332138586> ${Math.round(100 * no.length / totalVotes)}%`, no.length > yes.length)}`
                break
            case 'buttons':
            case 'selectmenu':
                embed.data.description = embed.data.description
                    .split('\n')
                    .map((option, i) => `[${Math.round(100 * pollData.votes[i].length / totalVotes)}%] ${option}`)
                    .join('\n')
                break
        }

        embed.data.footer = { text: 'poll ended' }

        // Disable 'end poll' button
        interaction.message.components[1].components[0].data.disabled = true

        await pollData.delete().catch(console.error)
        console.log(`[Database] - Deleted poll data`)
        await interaction.update({ embeds: [embed], components: [interaction.message.components[1]] })
    }
}

function boldText(text, condition) {
    return condition ? `**${text}**` : text
}