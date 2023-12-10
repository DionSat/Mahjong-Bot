const { SlashCommandBuilder, EmbedBuilder, Options } = require('discord.js')
const glossary = require('../data/reiichi-glossary.json');

module.exports = {
        data: new SlashCommandBuilder()
        .setName('efficiency')
        .setDescription('Check the efficiency of a hand')
        .addStringOption(option =>
            option
                .setName('hand')
                .setDescription('Hand to check efficiency')
                .setRequired(true)
                .setMaxLength(26)
                .setMinLength(26)
        ),

        async execute(interaction) {
            const { options } = interaction;

            const hand = options.getString('hand').toLowerCase();

            console.log(hand)

            // await interaction.deferReply({ ephemeral: true });
        }
}