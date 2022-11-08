const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Choose a random number, word, or randomize a list.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('number')
                .setDescription('Choose a random number from 0 to your number, or in a range from num1 to num2')
                .addNumberOption(option => option.setName('num1').setDescription('The maximum number, or the minimum if another number is used').setRequired(true))
                .addNumberOption(option => option.setName('num2').setDescription('The maximum number (optional)'))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('word')
                .setDescription('Choose a random word from a list of words')
                .addStringOption(option => option.setName('words').setDescription('a list of words seperated by (,)').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('order')
                .setDescription('Choose a random order for a list of words')
                .addStringOption(option => option.setName('words').setDescription('a list of words seperated by (,)').setRequired(true))
        ),
    async execute(interaction, client) {
        const { options } = interaction
        const embed = new EmbedBuilder()
            .setColor(client.color)
        switch (options.getSubcommand()) {
            case 'number':
                const num1 = options.getNumber('num1')
                const num2 = options.getNumber('num2')

                const min = num2 ? num1 : 0
                const max = num2 ? num2 : num1

                const r = Math.floor(Math.random() * (max - min) + min)
                embed.addFields({ name: 'Your number is', value: `**${r}**` })
                    .setFooter({ text: `range: ${min} - ${max}` })
                await interaction.reply({ embeds: [embed], ephemeral: true })
                break
            case 'word':
                const words = options.getString('words').split(/\s*,\s*/)
                if (words.length < 2) return await interaction.reply({ content: 'Please use a list of words seperated by a (,)\nexample: `apple, banana, orange`', ephemeral: true })
                else {
                    const r = words[Math.floor(Math.random() * words.length)]
                    embed.addFields({ name: 'Your word is', value: `**${r}**` })
                        .setFooter({ text: `chose from ${words.length} words` })
                    await interaction.reply({ embeds: [embed], ephemeral: true })
                }
                break
            case 'order':
                const list = options.getString('words').split(/\s*,\s*/).filter(w => w !== '')
                if (list.length < 2) return await interaction.reply({ content: 'Please use a list of words seperated by a (,)\nexample: `apple, banana, orange`', ephemeral: true })
                else {
                    const r = client.shuffleArray(list)
                    embed.addFields({ name: 'Your randomized list is', value: `${r.map((word, i) => `${i+1}. ${word}`).join('\n')}` })
                        .setFooter({ text: `total of ${list.length} words` })
                    await interaction.reply({ embeds: [embed], ephemeral: true })
                }
        }
    }
}