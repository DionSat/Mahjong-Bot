echo = new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Repeats what you say')
        .addStringOption(option => 
            option
                .setName('text')
                .setDescription('The user to repeat')
                .setRequired(true)
        )