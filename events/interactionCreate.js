module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if(!interaction.isChatInputCommand()) return;

        let command = client.commands.get(interaction.commandName);

        try {
            if(interaction.replied) return;
            command.execute(interaction);
        } catch (error) {
            console.error(error);
        }
    }
}