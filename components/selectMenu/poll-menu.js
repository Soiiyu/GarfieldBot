const Poll = require('../../schemas/polls')

module.exports = {
    data: {
        name: 'poll-menu'
    },
    async execute(interaction, client) {
        // Try finding a poll with the interaction.message.id
        const pollData = await Poll.findOne({ msgId: interaction.message.id });
        if (!pollData) return await interaction.reply({ content: 'Something went wrong when voting on this poll.', ephemeral: true })

        // If the user already voted for this option, ignore
        // Using the select menu values to determine which option the user chose
        if (pollData.votes[interaction.values[0]].includes(interaction.user.id)) return await interaction.deferUpdate()

        // If the user already voted, remove their vote from their previous choice, and add to their current choice
        pollData.votes = pollData.votes.map(option => {
            if (option.includes(interaction.user.id)) option.splice(option.indexOf(interaction.user.id), 1)
            return option
        })

        pollData.votes[interaction.values[0]].push(interaction.user.id)

        // Since arrays are 'mix' type in the database, signal it has been changed to update it
        pollData.markModified('votes')
        await pollData.save().catch(console.error)

        console.log(`[Database] - someone voted on a poll using select menu`)
        // updating total votes number (fields[2] because of the empty field)
        const totalVotes = Math.max(1, pollData.votes.reduce((votes, curr) => votes + curr.length, 0))
        interaction.message.embeds[0].fields[2].value = totalVotes.toString()
        
        // updaing the numbers in the select menu
        interaction.message.components[0].components[0].data.options = interaction.message.components[0].components[0].data.options
            .map((option, i) => {
                const temp = option.label.split(' ')
                temp[0] = `[${pollData.votes[i].length}]`
                option.label = temp.join(' ')
                return option
            })

        await interaction.update({ embeds: interaction.message.embeds, components: interaction.message.components })
        // await interaction.reply({ content: `you voted for option ${parseInt(interaction.values[0]) + 1}`, ephemeral: true })
        // console.log(interaction.message.components[0].components[0].data.options) // the select menu options if needed
    }
}