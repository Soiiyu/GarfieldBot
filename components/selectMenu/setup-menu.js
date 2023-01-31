const Guild = require('../../schemas/guild')
const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: {
        name: 'setup-menu'
    },
    async execute(interaction, client) {
        const guildProfile = await Guild.findOne({ guildId: interaction.guild.id });

        // display different descriptions based on which command was picked
        const commandTypes = {
            suggest: [
                'You may set the channel suggestions will be sent to'
            ].join('\n'),
            poll: [
                'You may set the channel poll will be sent to',
                'If no channel is set, the poll will be sent in the same channel the command was used'
            ].join('\n')
        }

        const embed = new EmbedBuilder()
            .setTitle(interaction.values[0])
            .setColor(client.color)
            .setDescription(commandTypes[interaction.values[0]])

        // Getting all server channels to put in select menus
        const categories = []
        const channels = JSON.parse(JSON.stringify(interaction.member.guild.channels)).guild.channels.map(id => {
            const channel = client.channels.cache.get(id)

            // If a channel is found outside of a category, add a 'uncategorized' category option
            if (channel.type == 0 && channel.parentId == null && !categories.find(category => category.name == 'uncategorised')) categories.push({
                type: 4,
                name: 'Uncategorised',
                id: '-1',
                parentId: null
            })
            return {
                type: channel.type, // 0 == text, 4 == category
                name: channel.name,
                id: channel.id,
                parentId: channel.parentId
            }
        })

        // Filter categories into the categories array, and text channels into it's own array
        categories.push(...channels.filter(({ type }) => type == 4))
        const textChannels = channels.filter(({ type }) => type == 0)

        // If there is only 1 category, show text channels, otherwise show categories first
        const selectMenu = categories.length > 1 ?
            new SelectMenuBuilder()
                .setCustomId('categories-menu')
                .setPlaceholder('Select a category')
                .addOptions(categories.map(({ name, id }) => ({ label: name, value: id }))) :
            new SelectMenuBuilder()
                .setCustomId('textchannels-menu')
                .setPlaceholder('Select a text channel')
                .addOptions([{ label: 'None', value: '-1' }, ...textChannels.map(({ name, id }) => ({ label: name, value: id }))])

        // Create a button to go back to the main page and adding it the the 2nd action row
        const back = new ButtonBuilder()
            .setCustomId(`setup-back`)
            .setEmoji('⏹')
            .setLabel('Back to menu')
            .setStyle(ButtonStyle.Danger);

        // Updaing message with the selected command, changing select menu to either category or text channels, and re-adding the menu back button
        await interaction.update({ embeds: [embed], components: [new ActionRowBuilder().addComponents(selectMenu), new ActionRowBuilder().addComponents(back)] })
    }
}