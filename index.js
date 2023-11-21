require('dotenv').config()
const {Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = getCommands('./commands');

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`)
})

const eventsPath = path.join(__dirname, 'events');
eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for(const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const even = require(filePath);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(process.env.DISCORD_TOKEN)

function getCommands(dir) {
    let commands = new Collection();
    const commandFiles = getFiles(dir);

    for(const commandFile of commandFiles) {
        const command = require(commandFile);
        commands.set(command.data.toJSON().name, command);
    }
    return commands;
}

function getFiles(dir) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    })
    let commandFiles = [];

    for(const file of files) {
        if(file.isDirectory()) {
            commandFiles = [
                ...commandFiles,
                ...getFiles(`${dir}/${file.name}`),
            ]
        } else if (file.name.endsWith(".js")) {
            commandFiles.push(`${dir}/${file.name}`);
        }
    }
    return commandFiles;
}