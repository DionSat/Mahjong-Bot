require('dotenv').config()
const {Client, GatewayIntentBits } = require('discord.js');
const { checkYT } = require('./utils.js')
const fs = require('node:fs')
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for(const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
        console.log("Test")
    }
}

client.login(process.env.DISCORD_TOKEN)