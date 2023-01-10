const Poll = require('../../schemas/polls')

module.exports = {
    data: {
        name: 'endpoll'
    },
    async execute(interaction, client, id) {
        const pollData = await Poll.findOne({ msgId: interaction.message.id });
        if (!pollData) return await interaction.reply({ content: 'This poll has already ended.', ephemeral: true })
        if (interaction.user.id !== id) return await interaction.deferUpdate()

        client.endPoll(interaction, pollData)
    }
}