const Guild = require('../../schemas/guild')
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const mongoose = require('mongoose')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestroom')
        .setDescription('Set or remove a text channel for suggestions.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set a channel for suggestions')
                .addChannelOption(option =>
                    option
                        .setName('room')
                        .setDescription('The room to send suggestions to.')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove suggestions from your server.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Info about the suggestion room status of this server.'))
    ,
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        const room = interaction.options.getChannel('room');

        switch (interaction.options.getSubcommand()) {
            case 'set':
                // Sets the server's suggestion room, and creates a database entry if there is non
                if (!guildProfile) {
                    guildProfile = new Guild({
                        _id: mongoose.Types.ObjectId(),
                        guildId: interaction.guild.id,
                        suggestChannel: room.id
                    })
                    await guildProfile.save().catch(console.error);
                    console.log(`[Database] - Created guild data for ${interaction.guild.name}`)
                    await interaction.reply({ content: `Set suggestion room to ${room}`, ephemeral: true })
                } else {
                    guildProfile.suggestChannel = room.id
                    await guildProfile.save().catch(console.error);
                    await interaction.reply({ content: `Changed suggestion room to ${room}`, ephemeral: true })
                }
                break;
            case 'remove':
                // Removes the server suggestion room from the database if there is one
                if (!guildProfile) {
                    await interaction.reply({ content: 'This server has not set up a suggestion room.', ephemeral: true })
                } else {
                    // currently deletes server db entry as nothing else uses the db.
                    // when the time comes, change this to set guildProfile.suggeestChannel to null
                    await guildProfile.delete().catch(console.error)
                    console.log(`[Database] - Deleted guild data for ${interaction.guild.name}`)
                    await interaction.reply({ content: 'Successfully removed suggestions from this server.', ephemeral: true })
                }
                break;
            case 'info':
                // Sends back if the server set up a suggestion room, and which if it has.
                if (!guildProfile) {
                    await interaction.reply({ content: 'This server has not set up a suggestion room.', ephemeral: true })
                } else {
                    await interaction.reply({ content: `This server set <#${guildProfile.suggestChannel}> as the suggestion room.`, ephemeral: true })
                }
                break;
        }
    }
}