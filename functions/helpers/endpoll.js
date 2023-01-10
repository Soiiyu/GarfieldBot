module.exports = client => {
    client.endPoll = async (interaction, poll) => {
        // If passed an interaction, use interaction.message, otherwise fetch the message using the msgId from the poll
        let message = interaction?.message
        if(!interaction) {
            const channel = await client.channels.cache.get(poll.channelId)
            message = await channel.messages.fetch(poll.msgId)
            interaction = message
        }

        // Generating poll results and updating the embed
        const embed = message.embeds[0]
        const highestVotes = [0]
        const totalVotes = Math.max(1, poll.votes.reduce((votes, curr) => {
            if(curr.length > highestVotes[0]) highestVotes[0] = curr.length
            return votes + curr.length
        }, 0))
        switch (poll.pollType) {
            case 'yesno':
                const [yes, no] = poll.votes
                embed.data.description = `${boldText(`<:Yes:712682828302909481> ${Math.round(100 * yes.length / totalVotes)}%`, yes.length > no.length)} - ${boldText(`<:No:712682828332138586> ${Math.round(100 * no.length / totalVotes)}%`, no.length > yes.length)}`
                break
            case 'buttons':
            case 'selectmenu':
                embed.data.description = embed.data.description
                    .split('\n')
                    .map((option, i) => boldText(`[${Math.round(100 * poll.votes[i].length / totalVotes)}%] ${option}`, poll.votes[i].length == highestVotes[0] && poll.votes[i].length !== 0))
                    .join('\n')
                break
        }

        // embed.data.footer = { text: 'poll ended' }
        // updating the "End in" field
        message.embeds[0].fields[0].name = 'Ended'
        message.embeds[0].fields[0].value = `<t:${Math.round(Date.now() / 1000)}:R>`

        // Disable 'end poll' button
        message.components[1].components[0].data.disabled = true

        await poll.delete().catch(console.error)
        console.log(`[Database] - Deleted poll data`)

        // Fetched messages use .edit() instead of .update(), this is to handle the difference
        if(typeof interaction.update == 'function') await interaction.update({ embeds: [embed], components: [message.components[1]] })
        else await interaction.edit({ embeds: [embed], components: [message.components[1]] })
    }
}

function boldText(text, condition) {
    text = text.replace(/\*\*/g, '')
    return condition ? `**${text}**` : text
}