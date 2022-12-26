const Poll = require('../../schemas/polls')

module.exports = {
    data: {
        name: 'endpoll'
    },
    async execute(interaction, client) {
        const pollData = await Poll.findOne({ msgId: interaction.message.id });
        if (!pollData) return await interaction.reply({ content: 'This poll has already ended.', ephemeral: true })

        const embed = interaction.message.embeds[0]
        const totalVotes = pollData.votes.reduce((votes, curr) => votes + curr.length, 0)
        embed.data.description = embed.data.description
            .split('\n')
            .map((option, i) => `[${Math.round(100 * pollData.votes[i].length / totalVotes)}%] ${option}`)
            .join('\n')
        embed.data.footer = { text: 'poll ended' }

        interaction.message.components[1].components[0].data.disabled = true

        await pollData.delete().catch(console.error)
        console.log(`[Database] - Deleted poll data`)
        await interaction.update({ embeds: [embed], components: [interaction.message.components[1]] })
    }
}

