const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const videoData = require('../data/yt.json');
const Parser = require('rss-parser');
const parser = new Parser();

module.exports = {
        data: new SlashCommandBuilder()
        .setName('notifier')
        .setDescription('Notify discord channel of new videos"'),
        

        async execute(interaction) {
                const { options } = interaction;
                const sub = options.getSubcommand();

                const ID = options.getString('channel-id')
                const title = options.getString('title')
                if(videoData.title === title && videoData.episode !== episode) {
                    const query = title

                    await interaction.deferReply({ephemeral: true});
                    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${ID}`;

                    let data = await parser.parseURL(url)
                    let { author } = data.items[0]

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
                        return await interaction.editReply({ content: `There are no **recent** videos matching \`${query}\` on  ${author}'s channel!`, ephemeral: true })
                    }
                    try {
                        await interaction.editReply({ content: `**Video Matching** \`${query}\` \n \n\`\`\`${videoTitle}\`\`\` \n \n \n> ${link} \n \n*Please note, not all links will be embedded*`, ephemeral: true})
                    } catch(e) {
                        return await interaction.editReply({ content: `There are **SO MANY** video matching ${query} that I cant send a message with them`, ephemeral: true})
                    }
                } else {
                    return
                }

        }
}