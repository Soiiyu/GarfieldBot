const Guild = require('../../schemas/guild')
const { ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: {
        name: 'categories-menu'
    },
    async execute(interaction, client) {
        // const guildProfile = await Guild.findOne({ guildId: interaction.guild.id });

        // Set field to indicate to user which category they are choosing from
        interaction.message.embeds[0].data.fields = [{
            name: 'Choosing from category',
            value: interaction.values[0] == '-1' ? 'Uncategorized' : `<#${interaction.values[0]}>`
        }]

        // Getting all server channels to put in the select menu
        const channels = JSON.parse(JSON.stringify(interaction.member.guild.channels)).guild.channels.map(id => {
            const channel = client.channels.cache.get(id)

            return {
                type: channel.type, // 0 == text, 4 == category
                name: channel.name,
                id: channel.id,
                parentId: channel.parentId
            }
        })

        // Filter all channels that are text channels, aswell as being under the selected category
        const textChannels = channels.filter(({ type, parentId }) => type == 0 && parentId == interaction.values[0])

        // If there is only 1 category, show text channels, otherwise show categories first
        const selectMenu = new SelectMenuBuilder()
            .setCustomId('textchannels-menu')
            .setPlaceholder('Select a text channel')
            .addOptions([{ label: 'None', value: '-1' }, ...textChannels.map(({ name, id }) => ({ label: name, value: id }))])

        // Create a button to go back and change categories
        const changeCategory = new ButtonBuilder()
            .setCustomId(`change-category`)
            .setEmoji('↩')
            .setLabel('Change category')
            .setStyle(ButtonStyle.Secondary);

        // adding the change category button to the existing 2nd row with the back button
        interaction.message.components[1].components.push(changeCategory)

        await interaction.update({ embeds: interaction.message.embeds, components: [new ActionRowBuilder().addComponents(selectMenu), interaction.message.components[1]] })
    }
}