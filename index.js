require('dotenv').config()
const {Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = getCommands('./commands');

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`)
})

client.on(Events.InteractionCreate, (interaction) => {

    if(!interaction.isChatInputCommand()) return;

    let command = client.commands.get(interaction.commandName);

    try {
        if(interaction.replied) return;
        command.execute(interaction);
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_TOKEN)