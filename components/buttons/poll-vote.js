const Poll = require('../../schemas/polls')

module.exports = {
    data: {
        name: 'poll-vote'
    },
    async execute(interaction, client, id) {
        const pollData = await Poll.findOne({ msgId: interaction.message.id });
        if (!pollData) return await interaction.reply({ content: 'Something went wrong when voting on this poll.', ephemeral: true })

        if (pollData.votes[id].includes(interaction.user.id)) return await interaction.deferUpdate()

        pollData.votes = pollData.votes.map(option => {
            if (option.includes(interaction.user.id)) option.splice(option.indexOf(interaction.user.id), 1)
            return option
        })

        pollData.votes[id].push(interaction.user.id)

        pollData.markModified('votes')
        await pollData.save().catch(console.error)

        console.log(`[Database] - someone voted on a poll`)
        // updating total votes number (fields[2] because of the empty field)
        const totalVotes = Math.max(1, pollData.votes.reduce((votes, curr) => votes + curr.length, 0))
        interaction.message.embeds[0].fields[2].value = totalVotes.toString()

        // updating the numbers on the buttons
        const buttons = interaction.message.components[0]
        buttons.components = buttons.components.map((button, i) => {
            button.data.label = pollData.votes[i].length.toString()
            return button
        })

        await interaction.update({ embeds: interaction.message.embeds, components: [buttons, interaction.message.components[1]] })
    }
}