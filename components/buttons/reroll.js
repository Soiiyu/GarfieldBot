module.exports = {
    data: {
        name: 'reroll'
    },
    async execute(interaction, client) {
        const embed = interaction.message.embeds[0]
        switch (interaction.message.interaction.commandName) {
            case 'random number':
                const range = embed.data.footer.text.substr(7).split(' ')
                const min = parseInt(range[0])
                const max = parseInt(range[2])

                const rNum = Math.floor(Math.random() * (max - min) + min)
                embed.data.fields[0].value = `**${rNum}**`

                await interaction.update({ embeds: [embed], components: interaction.message.components, ephemeral: true })
                break;
            case 'random word':

                break;
            case 'random order':
                const list = embed.data.fields[0].value
                    .split('\n')
                    .map((word, i) => word.replace(`${i + 1}. `, ''))

                const rList = client.shuffleArray(list)
                embed.data.fields[0].value = rList.map((word, i) => `${i + 1}. ${word}`).join('\n')
                await interaction.update({ embeds: [embed], components: interaction.message.components, ephemeral: true })
                break;
            default:
                break;
        }
    }
}