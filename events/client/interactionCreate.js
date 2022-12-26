module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client)
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'Something went wrong...',
                    ephemeral: true
                });
            }
        } else if (interaction.isButton()) {
            // Buttons may specify id inside customId, by following the customId with _<ID>
            const { buttons } = client;
            const { customId } = interaction;
            const [ type, id ] = customId.split('_')
            const button = buttons.get(type);
            if(!button) return new Error ('There is no code for this button')

            try {
                await button.execute(interaction, client, id);
            } catch (error) {
                console.log(error)
            }
        } else if (interaction.isSelectMenu()) {
            const { selectMenus } = client;
            const { customId } = interaction;
            const selectMenu = selectMenus.get(customId)
            if(!selectMenu) return new Error ('There is no code for this select menu')

            try {
                await selectMenu.execute(interaction, client);
            } catch (error) {
                console.log(error)
            }
        }
    }
}