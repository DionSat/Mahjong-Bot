module.exports = async (interaction, hand) => {
    
}

function parseHand(hand) {
    tiles = {}
    tileNumbers = []
    let j = 0
    for(let i = 0; i < hand.length; i++) {
        tileNumbers.push(hand[i])
        if(hand[i] === 'r') {
            tiles['red'] = tileNumbers
            tileNumbers = []
        }
        if(hand[i] === 'm') {
            tiles['man'] = tileNumbers
            tileNumbers = []
        }
        if(hand[i] === 'p') {
            tiles['pin'] = tileNumbers
            tileNumbers = []
        }
        if(hand[i] === 's') {
            tiles['sou'] = tileNumbers
            tileNumbers = []
        }        
        if(hand[i] === 'h') {
            if(tileNumbers.includes('8') || tileNumbers.includes('9')) {
                
            }
            else {
                tiles['honor'] = tileNumbers
                tileNumbers = []
            }
        }
    }
}