let { checkUpdates } = require('../functions/notifierLoop.js');
const { setIntervalAsync } = require('set-interval-async');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);

        if(checkUpdates) {
            console.log('checking...');
            setIntervalAsync(async () => {
                await checkUpdates(client)
              }, 3600000);
        }
    }
}