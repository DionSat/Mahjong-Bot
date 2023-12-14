module.exports = async (interaction, hand) => {
    
}

async function parseHand(hand) {
    tiles = {};
    tileNumbers = [];
    let j = 0;
    
    let channel = await client.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) return;

    for(let i = 0; i < hand.length; i++) {
        tileNumbers.push(hand[i])
        if(hand[i] === 'r') {
            tiles['red'] = tileNumbers;
            tileNumbers = [];
        }
        if(hand[i] === 'm') {
            tiles['man'] = tileNumbers;
            tileNumbers = [];
        }
        if(hand[i] === 'p') {
            tiles['pin'] = tileNumbers;
            tileNumbers = [];
        }
        if(hand[i] === 's') {
            tiles['sou'] = tileNumbers;
            tileNumbers = [];
        }        
        if(hand[i] === 'h') {
            if(tileNumbers.includes('8') || tileNumbers.includes('9')) {
                await channel.send({ content: `Warning honor tiles are not valid. Has to be a number 1 - 7 to represent east, west, north, south, green, white, red respectively.`, ephemeral: true });
            }
            else {
                tiles['honor'] = tileNumbers;
                tileNumbers = [];
            }
        }
    }

    return tileNumbers;
}