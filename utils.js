const { Client, Collection, GatewayIntentBits } = require('discord.js');
const videoData = require('./data/yt.json');
const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('node:fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

slashCommands = client.commands = getCommands('./commands');

async function checkYT() {
    const query = videoData.title.toLowerCase() + videoData.number.toLowerCase();
    const channelID = videoData.channelId
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`;
    console.log(query);
    console.log(channelID);
    console.log(url);

    let data = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`)

    let link = ""
    let videoTitle = ""

    await data.items.forEach(async value => {
        const title = value.title.toLowerCase();

        if (title.includes(query)) {
            link = value.link;
            videoTitle = value.title
        } else {
            return;
        }
    });
    console.log(link);
    console.log(videoTitle);

    if (link.length === 0 || videoTitle.length === 0) {
        return false;
    }
    return true;
}

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

exports.slashCommands = slashCommands;
exports.checkYT = checkYT;