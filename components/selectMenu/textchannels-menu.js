const Guild = require('../../schemas/guild')
const { ActionRowBuilder, SelectMenuBuilder, EmbedBuilder } = require('discord.js')
const mongoose = require('mongoose')

// command name to database key table
const dataKeys = {
    suggest: 'suggestChannel',
    poll: 'pollChannel'
}

module.exports = {
    data: {
        name: 'textchannels-menu'
    },
    async execute(interaction, client) {
        const guildProfile = await Guild.findOne({ guildId: interaction.guild.id });

        // based on the embed title determine which command needs to be set
        const dataType = dataKeys[interaction.message.embeds[0].data.title]
        const updatedValue = interaction.values[0] == '-1' ? null : interaction.values[0]

        // if there's a guildProfile, update it accordingly in the database
        if(guildProfile) {
            if(guildProfile[dataType] !== updatedValue) {
                guildProfile[dataType] = updatedValue
                await guildProfile.save().catch(console.error);
            console.log(`[Database] - Modified guild data for ${interaction.guild.name}`)
            }
        } else {
            // if there is no guild data, create a new entry
            guildProfile = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildId: interaction.guild.id,
                suggestChannel: null,
                pollChannel: null
            })

            guildProfile[dataType] = interaction.values[0] == '-1' ? null : interaction.values[0]
            await guildProfile.save().catch(console.error);
            console.log(`[Database] - Created guild data for ${interaction.guild.name}`)
        }

        // Set field to indicate to user which text channel they chose
        interaction.message.embeds[0].data.fields = [{
            name: 'Selected room',
            value: `${updatedValue ? `<#${interaction.values[0]}>` : 'None'}`
        }]

        await interaction.update({embeds: interaction.message.embeds})
    }
}