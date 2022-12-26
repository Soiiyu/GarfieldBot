const Poll = require('../../schemas/polls')

module.exports = {
    data: {
        name: 'poll-menu'
    },
    async execute(interaction, client) {
        const pollData = await Poll.findOne({ msgId: interaction.message.id});
        if(!pollData) return await interaction.reply({ content: 'Something went wrong when voting on this poll.', ephemeral: true })

        if(pollData.votes[interaction.values[0]].includes(interaction.user.id)) return

        pollData.votes = pollData.votes.map(option => {
            if(option.includes(interaction.user.id)) option.splice(option.indexOf(interaction.user.id), 1)
            return option
        })
        
        pollData.votes[interaction.values[0]].push(interaction.user.id)

        pollData.markModified('votes')
        await pollData.save().catch(console.error)

        console.log(`[Database] - someone voted on a poll using select menu`)
        await interaction.reply({content: `you voted for option ${parseInt(interaction.values[0]) + 1}`, ephemeral: true})
        // console.log(interaction.message.components[0].components[0].data.options) // the select menu options if needed
    }
}