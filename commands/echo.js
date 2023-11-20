const { SlashCommandBuilder } = require('discord.js')

module.exports = {
        data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Repeats what you say')
        .addStringOption(option => 
            option
                .setName('text')
                .setDescription('The user to repeat')
                .setRequired(true)
        ),

        async execute(interaction) {
            const text = interaction.options.getString('text');
            interaction.reply(text);
        }
}