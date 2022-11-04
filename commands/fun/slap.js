const { SlashCommandBuilder } = require('discord.js')
const slaps = require('./slaps.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap someone!')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user to slap')
                .setRequired(true)),
    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        let randomSlap = slaps[Math.floor(Math.random() * slaps.length)]
        await interaction.reply({content: `<@${interaction.user.id}> slapped <@${user.id}>\n${randomSlap}`})
    }
}