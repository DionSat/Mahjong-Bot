const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const videoData = require('../data/yt.json');
const Parser = require('rss-parser');
const parser = new Parser();
const fs = require('fs');

module.exports = {
        data: new SlashCommandBuilder()
        .setName('notifier')
        .setDescription('Notify discord channel of new videos"')
        .addSubcommand(command =>
                command
                    .setName('add')
                    .setDescription('Set up youtube notification system')
                    .addStringOption(option => 
                        option
                            .setName('channel-id')
                            .setDescription('The user to repeat')
                            .setRequired(true)
                    )
                    .addChannelOption(option => 
                        option
                            .setName('channel')
                            .setDescription('The channel to set the notification in')
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
                    .setDescription('Set up youtube notification system')
                    .addStringOption(option => 
                        option
                            .setName('title')
                            .setDescription('Title of the video')
                            .setRequired(true)
                    )
        ),
        

        async execute(interaction) {
                
        }
}