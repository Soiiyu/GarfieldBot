const choiceMessages = {
    rock: '✊ Rock',
    paper: '🖐 Paper',
    scissors: '✌ Scissors'
}

const winTable = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
}

module.exports = {
    data: {
        name: 'rockpaperscissors'
    },
    async execute(interaction, client, playerChoice) { // playerChoice is inherited from the button customId_id
        // Clearing the embed description and setting the image to the 3-2-1 gif
        interaction.message.embeds[0].data.description = ""
        interaction.message.embeds[0].data.image = {
            width: 498,
            height: 278,
            url: "https://media.tenor.com/7HFPLm7Rl8oAAAAC/321-count-down.gif",
            proxy_url: "https://media.tenor.com/7HFPLm7Rl8oAAAAC/321-count-down.gif"
        }
        await interaction.update({ embeds: interaction.message.embeds, components: [] })

        // Choosing a random option
        const computerChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)]

        // Determining who won, and storing it in results
        const results = {
            condition: null,
            message: '',
            color: ''
        }

        if (computerChoice === winTable[playerChoice]) {
            results.condition = 'player'
            results.message = 'You win!'
            results.color = parseInt("66ff66", 16) // green

        } else if (computerChoice === playerChoice) {
            results.condition = 'tie'
            results.message = "It's a tie!"
            results.color = parseInt("66c2ff", 16) // blue

        } else {
            results.condition = 'garfield'
            results.message = "You lose!"
            results.color = parseInt("ff5050", 16) // red

        }

        // Clearing the gif from the embed, setting the description to the results
        // and adding fields to display the choices
        interaction.message.embeds[0].data.description = `**__Results:__** \n ${results.message}`
        interaction.message.embeds[0].data.image = {}
        interaction.message.embeds[0].data.fields = [
            {   // Display a crown near the winner's name and bold their choice.
                name: '\u200b',
                value: `<@${interaction.user.id}> ${results.condition == 'player' ? '👑' : ''}\n${client.boldText(choiceMessages[playerChoice], results.condition == 'player')}`,
                inline: true
            },
            {
                name: '\u200b',
                value: `<@${client.user.id}> ${results.condition == 'garfield' ? '👑' : ''}\n${client.boldText(choiceMessages[computerChoice], results.condition == 'garfield')}`,
                inline: true
            }
        ]
        // Changing the color of the embed based on the results (green > player wins, red > player loses, blue > tie)
        interaction.message.embeds[0].data.color = results.color

        // Waiting 4 seconds and updating the message to display the results after playing the gif
        setTimeout(async () => {
            await interaction.editReply({ embeds: interaction.message.embeds, components: [] })
        }, 4000)
    }
}