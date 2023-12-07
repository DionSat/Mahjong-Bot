const { SlashCommandBuilder, EmbedBuilder, Options } = require('discord.js')
const glossary = require('../data/reiichi-glossary.json');

module.exports = {
        data: new SlashCommandBuilder()
        .setName('explain')
        .setDescription('Explain a reiichi word or phrase')
        .addStringOption(option =>
            option
                .setName('word')
                .setDescription('Word/Phrase you want explained')
                .setRequired(true)
        ),

        async execute(interaction) {
            const { options } = interaction;

            const keyword = options.getString('word').toLowerCase();

            await interaction.deferReply({ ephemeral: true });

            for(let i = 0; i < glossary.length; i++) {
                if(keyword == glossary[i].english.toLowerCase() || keyword == glossary[i].kanji || keyword == glossary[i].romaji.toLowerCase()) {
                    const embed = new EmbedBuilder()
                    .setTitle(keyword.toUpperCase())
                    .setColor("Yellow")
                    .addFields(
                        {
                            name: 'Romanji',
                            value: glossary[i].romaji,
                            inline: false
                        },
                        {
                            name: 'Kanji',
                            value: glossary[i].kanji,
                            inline: false
                        },
                        {
                            name: 'English',
                            value: glossary[i].english,
                            inline: false
                        },
                        {
                            name: 'Explanation',
                            value: glossary[i].explanation,
                            inline: false
                        }
                    )
    
                    return await interaction.editReply({
                        embeds: [embed],
                        ephemeral: true,
                    })
                }
            }
            return await interaction.editReply({ content: `Oops don't know. Please put a ticket with IT`, ephemeral: true });
        }
}