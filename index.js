require('dotenv').config()
const {Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`)
})

client.on(Events.InteractionCreate, interaction => {
    if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName === "ping") {
        interaction.reply("Pong!");
    }

    if(interaction.commandName === "hello") {
        const user = interaction.options.getUser('user') || interaction.user;
        interaction.reply(`Hello ${interaction.user.username}`);
    }

    if(interaction.commandName === "echo") {
        const text = interaction.options.getString('text');
        interaction.reply(text);
    }

    console.log(interaction);
});

client.login(process.env.DISCORD_TOKEN)