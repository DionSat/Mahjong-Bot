const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const videoData = require('../data/yt.json');
const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');

module.exports = {
        data: new SlashCommandBuilder()
        .setName('notifier')
        .setDescription('Notify discord channel of new videos"'),
        

        async execute(interaction) {
                if(videoData.title) {
                    // Parse the current title and increment the episode to look for a new one
                    const query = videoData.title.replace(/(\d+)+/g, function(match, number) {
                        return parseInt(number) + 1;
                    }).toLowerCase();
                    const ID = videoData.channelID;
                    console.log(query)

                    await interaction.deferReply({ephemeral: true});
                    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${ID}`;

                    let data = await parser.parseURL(url);

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
                    console.log(videoTitle);
                    console.log(link);

                    if (link.length === 0 || videoTitle.length === 0) {
                        return await interaction.deleteReply();
                    } else {
                        videoData.title = videoTitle; // Update JSON in memory object with new current title
                        fs.writeFileSync('./data/yt.json', JSON.stringify(videoData)); // Write JSON object to json file
                        await interaction.editReply({ content: `\`\`\`${videoTitle}\`\`\` \n \n \n> ${link} \n \n*Please note, not all links will be embedded*`, ephemeral: true});
                    }
                } else {
                    return
                }

        }
}