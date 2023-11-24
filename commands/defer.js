const { SlashCommandBuilder } = require('discord.js')

module.exports = {
        data: new SlashCommandBuilder()
        .setName('defer')
        .setDescription('Defer reply example"'),

        async execute(interaction) {
                await interaction.deferReply({ephemeral: true});
                await interaction.editReply({content: "Hello"});

                await interaction.followUp({content: "Hello again!"});
        }
}