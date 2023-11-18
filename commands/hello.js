hello = new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Says hello to someone"')
        .addUserOption(option => 
            option
                .setName('user')
                .setDescription('The user to say hi to')
                .setRequired(false)
        )