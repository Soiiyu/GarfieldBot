const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js')

module.exports = {
    data: {
        name: 'change-category'
    },
    async execute(interaction, client) {
        
        // Set field to indicate to user that they may select a different category
        interaction.message.embeds[0].data.fields = [{
            name: 'Changing category',
            value: `Select a different category`
        }]
        
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

        // Filter categories into the categories array
        categories.push(...channels.filter(({ type }) => type == 4))

        // If there is only 1 category, show text channels, otherwise show categories first
        const selectMenu = new SelectMenuBuilder()
            .setCustomId('categories-menu')
            .setPlaceholder('Select a category')
            .addOptions(categories.map(({ name, id }) => ({ label: name, value: id })))

        // removing the change category button, assuming it's the last one
        interaction.message.components[1].components.pop()

        await interaction.update({embeds: interaction.message.embeds, components: [new ActionRowBuilder().addComponents(selectMenu), interaction.message.components[1]] })
    }
}