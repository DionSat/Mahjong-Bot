const { SlashCommandBuilder, EmbedBuilder, Options } = require('discord.js')
const calculator = require('../functions/efficiency.js');

module.exports = {
        data: new SlashCommandBuilder()
        .setName('efficiency')
        .setDescription('Check the efficiency of a hand')
        .addStringOption(option =>
            option
                .setName('hand')
                .setDescription('Hand to check efficiency')
                .setRequired(true)
        ),

        async execute(interaction) {
            const { options } = interaction;

            const hand = options.getString('hand').toLowerCase();

            await interaction.deferReply({ ephemeral: true });

            await calculator(interaction, hand);
        }
}