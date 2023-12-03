require('dotenv').config()
const Parser = require('rss-parser');
const parser = new Parser();
const videoData = require('../data/yt.json');
const fs = require('fs');

module.exports = {
    checkUpdates: async (client) => {
        if (!videoData) {
            return
        } else {
            // Parse the current title and increment the episode to look for update
            const query = videoData.title.replace(/(\d+)+/g, function (match, number) {
                return parseInt(number) + 1;
            }).toLowerCase();
            const ID = videoData.channelID;

            // await interaction.deferReply({ ephemeral: true });
            const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${ID}`;

            let data = await parser.parseURL(url);
            if (!data) return;

            let channel = await client.channels.cache.get(process.env.CHANNEL_ID);
            if (!channel) return;

            let link = "";
            let videoTitle = "";

            await data.items.forEach(async value => {
                const title = value.title.toLowerCase();

                if (title.includes(query)) {
                    link = value.link;
                    videoTitle = value.title;
                } else {
                    return;
                }
            });

            if (link.length === 0 || videoTitle.length === 0) {
                return;
            } else {
                videoData.title = videoTitle; // Update JSON in memory object with new current title
                fs.writeFileSync('./data/yt.json', JSON.stringify(videoData)); // Write JSON object to json file
                await channel.send({ content: `\`\`\`${videoTitle}\`\`\` \n> ${link} \n \n*Please note, not all links will be embedded*`, ephemeral: true });
                return;
            }
        }
    }
}