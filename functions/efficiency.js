function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

module.exports = async (interaction, hand) => {
    //There need to be 4 sequences/triplets and a double for there to be a basic yaku
    tiles = await parseHand(hand, interaction);
    blocks = [];
    let sets = 0;
    let pairs = 0;
    let partial = 0;
    for(let k in tiles) {
        let num = tiles[k];
        let i = 0;
        console.log(tiles[k]);
        while(i < num.length) {
            // if its a triple sequence
            if(num[i] + 1 === num[i + 1] && num[i] + 2 === num[i + 2]) {
                blocks.push([num[i], num[i + 1], num[i + 2]]);
                i += 3;
                sets += 1;
            }
            // if its a pair
            else if(num[i] === num[i + 1] && num[i] !== num[i + 2]) {
                blocks.push([num[i], num[i + 1]]);
                i += 2;
                pairs += 1;
            }
            // if its a triple
            else if(num[i] === num[i + 1] && num[i] === num[i + 2]) {
                blocks.push([num[i], num[i + 1], num[i + 2]]);
                i += 3;
                sets += 1;
            }
            // if its a partial 2 wait sequence
            else if(num[i] + 1 === num[i + 1] && num[i + 1] + 1 !== num[i + 2]) {
                // if end of partial is part of a pair ignore the partial
                if(num[i + 1] === num[i + 2]) {
                    blocks.push([num[i + 1], num[i + 2]]);
                    i += 3;
                    pairs += 1;
                }
                else {
                    blocks.push([num[i], num[i + 1]]);
                    i += 2;
                    partial += 1;
                }
            }
            // if its a partial 1 wait sequence
            else if(num[i] + 2 === num[i + 1]) {
                // if end of partial is part of a pair ignore the partial
                if(num[i + 1] === num[i + 2]) {
                    blocks.push([num[i + 1], num[i + 2]]);
                    i += 3;
                    pairs += 1;
                }
                else {
                    blocks.push([num[i], num[i + 1]]);
                    i += 2;
                    partial += 1;
                }
            }
            else {
                blocks.push([num[i]]);
                i += 1;
            }
        }
    }
    console.log("Blocks: ", blocks);
    let shantenScore = calculateShanten(sets, pairs, partial);
    console.log("Shanten: ", shantenScore);
}

async function parseSequence(hand, blocks, sets) {
    let l = 0
    let r = 0
    let seq = {}
    while (l < hand.length) {
        if (seq.length === 3) {
            l += 1
            blocks.push(seq)
            sets += 1
            seq = []
            seq.push(hand[l])
        }
        if(l === r) {
            seq[l] = hand[l]
        }
        if(hand[l] + 1 === hand[r]) {
            seq[r] = hand[r]
            seqLen -= 1
        }
        else {
            r += 1
        }
    }
}

async function parseHand(hand, interaction) {
    tiles = {};
    tileNumbers = [];

    for(let i = 0; i < hand.length; i++) {
        if(hand[i] === 'm') {
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
        else if(isNumeric(hand[i])){
            number = parseInt(hand[i]);
            tileNumbers.push(number)
        }
        else {
            await interaction.editReply({ content: `Warning invalid input. has to use the values 1 - 9 and alpha symbols m, p, s, r and h. Being man, pin, sou, red, and honor tiles respectively. Note that honor tile have the range 1 - 7.`, ephemeral: true });
        }
    }

    return tiles;
}

function calculateShanten(sets, pairs, partials) {
    let blocks = 0;
    let constant = 9;
    let diff = 0;
    if(sets > 0) {
        if(pairs > 0) {
            diff += 1;
        }
        if(sets < 5) {
            diff += (2 * sets);
            if(partials > (4 - sets)) {
                diff += (4 - sets);
            }
            else {
                diff += partials;
            }
        }
        else if (sets > 4) {
            diff += 8;
        }
    }
    else {
        if(pairs > 0) {
            diff += 1;
        }
        if(partials > 4) {
            diff += 4
        }
        else if (partials < 5) {
            diff += partials
        }
    }
    let shanten = constant - diff;
    return shanten;
}