module.exports = async (interaction, hand) => {
    //There need to be 4 sequences/triplets and a double for there to be a basic yaku
    tiles = await parseHand(hand, interaction);
    console.log(tiles);
    blocks = [];
    for(let k in tiles) {
        let num = tiles[k];
        let i = 0;
        while(i < num.length) {
            console.log(num[i]);
            // if its a triple sequence
            if(num[i] + 1 === num[i + 1] && num[i] + 2 === num[i + 2]) {
                blocks.push([num[i], num[i + 1], num[i + 2]]);
                i += 3;
            }
            // if its a triple
            else if(num[i] === num[i + 1] && num[i] === num[i + 2]) {
                blocks.push([num[i], num[i + 1], num[i + 2]]);
                i += 3;
            }
            // if its a pair
            else if(num[i] === num[i + 1] && num[i] !== num[i + 2]) {
                blocks.push([num[i], num[i + 1]]);
                i += 2;
            }
            else {
                i += 1;
            }
        } 
    }
    console.log("Blocks: ", blocks);
}

async function parseHand(hand, interaction) {
    tiles = {};
    tileNumbers = [];

    for(let i = 0; i < hand.length; i++) {
        if(hand[i] === 'r') {
            tileNumbers.sort();
            tiles['red'] = tileNumbers;
            tileNumbers = [];
        }
        else if(hand[i] === 'm') {
            tileNumbers.sort();
            tiles['man'] = tileNumbers;
            tileNumbers = [];
        }
        else if(hand[i] === 'p') {
            tileNumbers.sort();
            tiles['pin'] = tileNumbers;
            tileNumbers = [];
        }
        else if(hand[i] === 's') {
            tileNumbers.sort();
            tiles['sou'] = tileNumbers;
            tileNumbers = [];
        }        
        else if(hand[i] === 'h') {
            tileNumbers.sort();
            if(tileNumbers.includes('8') || tileNumbers.includes('9')) {
                await interaction.editReply({ content: `Warning honor tiles are not valid. Has to be a number 1 - 7 to represent east, west, north, south, green, white, red respectively.`, ephemeral: true });
            }
            else {
                tiles['honor'] = tileNumbers;
                tileNumbers = [];
            }
        }
        else {
            tileNumbers.push(hand[i])
        }
    }

    return tiles;
}