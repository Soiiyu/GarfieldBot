const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Detailed information about Garfield bot.'),
    async execute(interaction, client) {
        const main = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail("https://i.imgur.com/EKmNSiO.png")
            .setTitle("Hello there! 👋")
            .setDescription([
                "I'm Garfield, the lazy orange cat that eats lasagna.",
                "I have a bunch of commands that you can explore in the following list.",
            ].join("\n"))
            .setFields(
                {
                    name: "Useful links:",
                    value: "[Website](https://garifled.alux.wtf)",
                    inline: true
                },
                {
                    name: "\u200b",
                    value: "[Invite me](https://invite.alux.wtf)",
                    inline: true
                },
                {
                    name: "\u200b",
                    value: "[Support server](https://server.alux.wtf)",
                    inline: true
                }
            )
        // Getting the command list, seperating between regular and admin commands
        const { commandArray } = client
        const regularCommands = []
        const adminCommands = []

        commandArray
            .sort((cmd) => { // Sorting normal and subcommands so that subcommands appear at the bottom of the list
                const isSubcommand = (cmd.options.length > 0 && cmd.options[0].type == 1)
                cmd.isSubcommand = isSubcommand
                return isSubcommand ? 1 : -1
            })
            .forEach(({ name, description, id, options, isSubcommand, default_member_permissions }) => {
                // If the output is a subcommand, format all the options. Otherwise just send the /command with it's description
                const output = isSubcommand ? `**${name}**\n${options.map(option => `ー </${name} ${option.name}:${id}> ${option.description}`).join('\n')}` : `</${name}:${id}> ${description}`
                
                // If the command has a default permission, add it to the admin commands instead
                if (!default_member_permissions) regularCommands.push(output)
                else adminCommands.push(output)
            })

        const commandEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Command list 😺")
            .setDescription(regularCommands.join('\n'))
        const adminCommandEmbed = new EmbedBuilder()
            .setColor('d94c30')
            .setTitle("Admin Commands 🔧")
            .setDescription(adminCommands.join('\n'))

        await interaction.reply({ embeds: [main, commandEmbed, adminCommandEmbed], ephemeral: true })
    }
}