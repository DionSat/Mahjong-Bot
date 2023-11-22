const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
        data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help menu for the bot"'),

        async execute(interaction) {
            const embed = new EmbedBuilder()
                .setTitle('Help')
                .setDescription('Bot help menu')
                .setColor("Gold")
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()
                .addFields(
                    {
                        name: 'FAQs',
                        value: 'example text',
                        inline: true
                    },
                    {
                        name: 'More Help',
                        value: 'Join Our Support Server',
                        inline: true
                    }
                )

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })
        }
}