const { SlashCommandBuilder } = require('discord.js')

module.exports = {
        data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hello to someone"')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user to say hi to')
                .setRequired(false)
        ),

        async execute(interaction) {
            const user = interaction.options.getUser('user') || interaction.user;
            interaction.reply(`Hello ${interaction.user.username}`);
        }
}