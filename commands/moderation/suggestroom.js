const Guild = require('../../schemas/guild')
const { SlashCommandBuilder } = require('discord.js')
const mongoose = require('mongoose')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestroom')
        .setDescription('Sets a text channel for suggestions.')
        .addChannelOption(option =>
            option
                .setName('room')
                .setDescription('The room to send suggestions to.')
                .setRequired(true)),
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        const room = interaction.options.getChannel('room');

        if (!guildProfile) {
            guildProfile = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildId: interaction.guild.id,
                suggestChannel: room.id
            })
            await guildProfile.save().catch(console.error);
            console.log(`[Database] - Created guild data for ${interaction.guild.name}`)
            await interaction.reply({ content: `Set suggestion room to ${room}` })
        } else {
            guildProfile.suggestChannel = room.id
            await guildProfile.save().catch(console.error);
            await interaction.reply({ content: `Changed suggestion room to ${room}` })
        }
        
    }
}