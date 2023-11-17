require('dotenv').config()
const {Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`)

    const ping = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with "Pong!"')

    client.application.commands.create(ping, "518309568632193036");
})

client.on(Events.InteractionCreate, interaction => {
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName === "ping") {
        interaction.reply("Pong!");
    }
    console.log(interaction);
});

client.login(process.env.DISCORD_TOKEN)