const Guild = require('../../schemas/guild')
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js')
const mongoose = require('mongoose')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Configure some command behavior.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const guildProfile = await Guild.findOne({ guildId: interaction.guild.id });

        // The description is set based on whether the server has a guildProfile in the database or not
        // If it does, show the user whether the commands have been set up, and if so, what settings (in this case, which text channel)
        const embed = new EmbedBuilder()
            .setTitle('Garfield Setup')
            .setColor(client.color)
            .setDescription([
                'You can configure some commands to better fit your needs.',
                '',
                `${guildProfile ?
                    [
                        'The following commands have been configured:',
                        `</suggest:1047223622445584425> - ${guildProfile.suggestChannel ? `<#${guildProfile.suggestChannel}>` : '`none`'}`,
                        `</poll:1042431146400682048> - ${guildProfile.pollChannel ? `<#${guildProfile.pollChannel}>` : '`any`'}`
                    ].join('\n')
                    : 'Your server has not been set up yet.'}`,
                '',
                'Select which command you would like to manage:'
            ].join('\n'))

        // prompt the user to select which command they want to modify
        const selectMenu = new SelectMenuBuilder()
            .setCustomId('setup-menu')
            .setPlaceholder('Select a command')
            .addOptions([
                {label: 'suggest', value: 'suggest'},
                {label: 'poll', value: 'poll'}
            ])

        await interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(selectMenu)], ephemeral: true })
    }
}