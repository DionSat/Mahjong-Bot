module.exports = {
    name: 'ready',
    once: false,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`)
    }
}