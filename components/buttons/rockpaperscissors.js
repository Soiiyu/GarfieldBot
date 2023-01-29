const choiceMessages = {
    rock: '✊ Rock',
    paper: '🖐 Paper',
    scissors: '✌ Scissors'
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
        let results

        if (playerChoice === computerChoice) {
            results = "It's a tie!"
        } else if (playerChoice === 'rock' && computerChoice === 'scissors') {
            results = "You win!"
        } else if (playerChoice === 'rock' && computerChoice === 'paper') {
            results = "You lose!"
        } else if (playerChoice === 'paper' && computerChoice === 'rock') {
            results = "You win!"
        } else if (playerChoice === 'paper' && computerChoice === 'scissors') {
            results = "You lose!"
        } else if (playerChoice === 'scissors' && computerChoice === 'paper') {
            results = "You win!"
        } else if (playerChoice === 'scissors' && computerChoice === 'rock') {
            results = "You lose!"
        }

        // Clearing the gif from the embed, setting the description to the results
        // and adding fields to display the choices
        interaction.message.embeds[0].data.description = `**__Results:__** \n ${results}`
        interaction.message.embeds[0].data.image = {}
        interaction.message.embeds[0].data.fields = [
            {
                name: "You chose:",
                value: choiceMessages[playerChoice],
                inline: true
            },
            {
                name: "I chose:",
                value: choiceMessages[computerChoice],
                inline: true
            }
        ]
        // Changing the color of the embed based on the results (green > player wins, red > player loses, blue > tie)
        if (results == "You win!") interaction.message.embeds[0].data.color = parseInt("66ff66", 16)
        else if (results == "You lose!") interaction.message.embeds[0].data.color = parseInt("ff5050", 16)
        else if (results == "It's a tie!") interaction.message.embeds[0].data.color = parseInt("66c2ff", 16)

        // Waiting 4 seconds and updating the message to display the results after playing the gif
        setTimeout(async () => {
            await interaction.editReply({ embeds: interaction.message.embeds, components: [] })
        }, 4000)
    }
}