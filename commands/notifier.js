const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const videoData = require('../data/yt.json');
const fs = require('fs');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('notifier')
                .setDescription('Notify discord channel of new videos"')
                .addSubcommand(command =>
                        command
                                .setName('add')
                                .setDescription('Set up youtube notifications')
                                .addStringOption(option =>
                                        option
                                                .setName('channel-id')
                                                .setDescription('The user to repeat')
                                                .setRequired(true)
                                )
                                .addStringOption(option =>
                                        option
                                                .setName('title')
                                                .setDescription('Title of the video')
                                                .setRequired(true)
                                )
                )
                .addSubcommand(command =>
                        command
                                .setName('remove')
                                .setDescription('Remove youtube notifications')
                ),


        async execute(interaction) {
                const { options } = interaction;

                const sub = options.getSubcommand();

                switch (sub) {
                        case 'add':
                                const ID = options.getString('channel-id');
                                const title = options.getString('title');

                                await interaction.deferReply({ ephemeral: true });

                                if (Object.keys(videoData).length === 0) {
                                        videoData['channelID'] = ID;
                                        videoData['title'] = title;

                                        fs.writeFileSync('./data/yt.json', JSON.stringify(videoData)); // Write JSON object to json file
                                        return await interaction.editReply({ content: `Added channel with ID ${ID} and video title ${title} to the notifier. Notifier Enabled!`, ephemeral: true });                            
                                }
                                else {
                                        videoData.channelID = ID;
                                        videoData.title = title;

                                        fs.writeFileSync('./data/yt.json', JSON.stringify(videoData)); // Write JSON object to json file
                                        return await interaction.editReply({ content: `Added channel with ID ${ID} and video title ${title} to the notifier. Notifier Enabled!`, ephemeral: true });
                                }

                        case 'remove':
                                await interaction.deferReply({ ephemeral: true });

                                if (Object.keys(videoData).length === 0) {
                                        return await interaction.editReply({ content: 'Notifier is already disabled!', ephemeral: true });
                                }
                                else {
                                        for(const key in videoData) {
                                                delete videoData[key];
                                        }
                                        fs.writeFileSync('./data/yt.json', JSON.stringify(videoData)); // Write JSON object to json file
                                        return await interaction.editReply({ content: 'Disabled the notifier!', ephemeral: true });
                                }
                }
        }
}