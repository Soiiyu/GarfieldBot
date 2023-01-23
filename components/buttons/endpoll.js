const Poll = require('../../schemas/polls')

module.exports = {
    data: {
        name: 'endpoll'
    },
    async execute(interaction, client, id) {
        // Try finding a poll with the interaction.message.id
        const pollData = await Poll.findOne({ msgId: interaction.message.id });
        if (!pollData) return await interaction.reply({ content: 'This poll has already ended.', ephemeral: true })

        // If the user who pressed it is not the poll author, ignore.
        // id is stored in endPoll button customId
        if (interaction.user.id !== id) return await interaction.deferUpdate()

        client.endPoll(interaction, pollData)
        delete client.pollTimeouts[pollData.msgId]
    }
}