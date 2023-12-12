module.exports = async (interaction, hand) => {
    
}

function parseHand(hand) {
    tiles = []
    let j = 0
    for(let i = 0; i < hand.length; i++) {
        if(hand[i] === 'g') {
            tiles[j] = 30 + hand[i - 1]
            j++
        }
        if(hand[i] === 'm') {
            tiles[j] = 10 + hand[i - 1]
            j++
        }
        if(hand[i] === 'p') {
            tiles[j] = 20 + hand[i - 1]
            j++
        }
        if(hand[i] === 's') {
            tiles[j] = 30 + hand[i - 1]
            j++
        }
    }
}