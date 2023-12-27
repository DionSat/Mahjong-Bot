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
    let tripleSets = 0
    let seqSets = 0
    let pairs = 0;
    let partials = 0;
    for(let k in tiles) {
        console.log(tiles[k]);
        seqSets = await parseSequences(tiles[k], blocks, seqSets)
        tripleSets = await parseTriplets(tiles[k], blocks, tripleSets)
        pairs = await parsePairs(tiles[k], blocks, pairs)
        partials = await parsePartials(tiles[k], blocks, partials)
        sets += seqSets + tripleSets
        seqSets = 0
        tripleSets = 0
    }
    console.log("Blocks: ", blocks);
    let shantenScore = calculateShanten(sets, pairs, partials);
    console.log("Shanten: ", shantenScore);
}

async function parseSequences(hand, blocks, sets) {
    let arr = hand.slice();
    for(let i = 0; i < hand.length; i++) {
        let s1 = arr[i];
        let s2 = binarySearch(arr, arr[i] + 1, i, arr.length);
        let s3 = binarySearch(arr, arr[i] + 2, i, arr.length);
        if(s2 !== -1 && s3 !== -1) {
            let seq = []
            seq.push(s1)
            seq.push(arr[s2])
            seq.push(arr[s3])
            blocks.push(seq)
            sets += 1
            arr.splice(i, 1)
            arr.splice(s2, 1)
            arr.splice(s3, 1)
        }
    }
    return sets
}

function binarySearch(arr, x, start, end) {
    // Base Condition
    if (start > end) return -1;
    
    // Find the middle index
    let mid = Math.floor((start + end) / 2);

    // Compare mid with given key x
    if (arr[mid] === x) return mid;

    // If element at mid is greater than x,
    // search in the left half of mid
    if (arr[mid] > x)
        return binarySearch(arr, x, start, mid - 1);
    else

        // If element at mid is smaller than x,
        // search in the right half of mid
        return binarySearch(arr, x, mid + 1, end);
}

async function parsePairs(hand, blocks, pairs) {
    let i = 0
    while (i < hand.length) {
        if(hand[i + 1] === hand[i]) {
            let seq = []
            seq.push(hand[i])
            seq.push(hand[i + 1])
            blocks.push(seq)
            pairs += 1
            i += 2
        }
        i += 1
    }
    return pairs
}

async function parseTriplets(hand, blocks, sets) {
    let i = 0
    while (i < hand.length) {
        if(hand[i + 1] === hand[i] && hand[i + 2] === hand[i]) {
            let seq = []
            seq.push(hand[i])
            seq.push(hand[i + 1])
            seq.push(hand[i + 2])
            blocks.push(seq)
            sets += 1
            i += 3
        }
        i += 1
    }
    return sets
}

async function parsePartials(hand, blocks, partials) {
    let i = 0
    while (i < hand.length) {
        if(hand[i + 1] === hand[i] + 2 || hand[i + 1] === hand[i] + 1 && hand[i + 2] !== hand[i + 1] + 1) {
            let seq = []
            seq.push(hand[i])
            seq.push(hand[i + 1])
            blocks.push(seq)
            partials += 1
            i += 2
        }
        i += 1
    }
    return partials
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