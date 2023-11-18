require('dotenv').config()
const {Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`)

    const hello = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with "Pong!"')

    const ping = new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hello to someone"')

    client.application.commands.create(ping, "518309568632193036");
    client.application.commands.create(hello, "518309568632193036");
})

client.on(Events.InteractionCreate, interaction => {
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName === "ping") {
        interaction.reply("Pong!");
    }

    if(interaction.commandName === "hello") {
        interaction.reply(`Hello ${interaction.user.username}`);
    }
    console.log(interaction);
});

client.login(process.env.DISCORD_TOKEN)