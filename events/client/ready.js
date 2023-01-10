const Poll = require('../../schemas/polls')
const mongoose = require('mongoose');
const { ActivityType } = require('discord.js');
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready as ${client.user.tag} 🐈`)

        client.user.setActivity('to MeowRemix.wav', { type: ActivityType.Listening })

        // Adding timeouts for timed polls and removing expired ones
        const polls = await Poll.find({})
        if(polls) {
            polls.forEach(poll => {
                if(poll.endTime < Date.now()) {
                    console.log(`Detected poll that ended`)
                    client.endPoll(null, poll)
                }
            })
        }
    }
}