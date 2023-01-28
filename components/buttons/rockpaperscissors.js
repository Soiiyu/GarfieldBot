module.exports = {
    data: {
        name: 'rockpaperscissors'
    },
    async execute(interaction, client, playerChoice) {
        
        interaction.message.embeds[0].data.description = ""
        interaction.message.embeds[0].data.image = {
            width: 498,
            height: 278,
            url: "https://media.tenor.com/7HFPLm7Rl8oAAAAC/321-count-down.gif",
            proxy_url: "https://media.tenor.com/7HFPLm7Rl8oAAAAC/321-count-down.gif"
        }
        await interaction.update({ embeds: interaction.message.embeds, components: [] }).then(async message => {
            const computerChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)]

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

        interaction.message.embeds[0].data.description = `**__Results:__** \n ${results}`
        interaction.message.embeds[0].data.image = {}
        interaction.message.embeds[0].data.fields = [
                {
                    name: "You chose:",
                    value: playerChoice,
                    inline: true
                },
                {
                    name: "I chose:",
                    value: computerChoice,
                    inline: true
                }
        ]
        if (results == "You win!")
            interaction.message.embeds[0].data.color = parseInt("66ff66", 16)
        else if (results == "You lose!")
            interaction.message.embeds[0].data.color = parseInt("ff5050", 16)
        else if (results == "It's a tie!")
            interaction.message.embeds[0].data.color = parseInt("66c2ff", 16) 

        setTimeout(async() => {
            await interaction.editReply({ embeds: interaction.message.embeds, components: [] })
        }, 4000);
        })

    }
}