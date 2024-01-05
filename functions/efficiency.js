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
    let honorPairs = 0
    let tempPairs = 0
    let pairs = 0;
    let partials = 0;
    let len = 0
    for(let k in tiles) {
        len += tiles[k].length
        if(k === 'honor') {
            honorPairs = await parsePairs(tiles[k], blocks, honorPairs)
            continue
        }
        console.log(tiles[k]);
        seqSets = await parseSequences(tiles[k], blocks, seqSets)
        tripleSets = await parseTriplets(tiles[k], blocks, tripleSets)
        tempPairs = await parsePairs(tiles[k], blocks, tempPairs)
        partials += await parsePartials(tiles[k], blocks, partials)
        sets += seqSets + tripleSets
        pairs += honorPairs + tempPairs
        seqSets = 0
        tripleSets = 0
    }
    console.log("Blocks: ", blocks);
    let shantenScore = calculateShanten(len, sets, pairs, partials);
    console.log("Shanten: ", shantenScore);
}

async function parseSequences(hand, blocks, sets) {
    for(let i = 0; i < hand.length; i++) {
        let s2 = binarySearch(hand, hand[i].number + 1, i, hand.length - 1);
        let s3 = binarySearch(hand, hand[i].number + 2, i, hand.length - 1);
        if(s2 !== -1 && s3 !== -1 && hand[i].considered === true && hand[s2].considered === true && hand[s3].considered === true) {
            let seq = []
            seq.push({ number: hand[i].number, isSeq: true, isTriple: false, isPair: false, isPartial: false})
            seq.push({ number: hand[s2].number, isSeq: true, isTriple: false, isPair: false, isPartial: false})
            seq.push({ number: hand[s3].number, isSeq: true, isTriple: false, isPair: false, isPartial: false})
            blocks.push(seq)
            hand[i].considered = false;
            hand[s2].considered = false;
            hand[s3].considered = false;
            sets += 1
        }
    }
    return sets
}

function binarySearch(arr, x, start, end) {
    // Base Condition
    if (start > end) return -1
    
    // Find the middle index
    let mid = Math.floor((start + end) / 2)

    // Compare mid with given key x
    if (arr[mid].number === x) return mid

    // If element at mid is greater than x,
    // search in the left half of mid
    if (arr[mid].number > x) {
        return binarySearch(arr, x, start, mid - 1)
    }
    else {
        // If element at mid is smaller than x,
        // search in the right half of mid
        return binarySearch(arr, x, mid + 1, end)
    }
}

async function parseTriplets(hand, blocks, sets) {
    let i = 0
    while (i < hand.length - 2) {
        if(hand[i + 1].number === hand[i].number && hand[i + 2].number === hand[i].number && hand[i].considered === true && hand[i + 1].considered === true && hand[i + 2].considered === true) {
            let seq = []
            seq.push({ number: hand[i].number, isSeq: false, isTriple: true, isPair: false, isPartial: false})
            seq.push({ number: hand[i + 1].number, isSeq: false, isTriple: true, isPair: false, isPartial: false})
            seq.push({ number: hand[i + 2].number, isSeq: false, isTriple: true, isPair: false, isPartial: false})
            blocks.push(seq)
            sets += 1
            hand[i].considered = false;
            hand[i + 1].considered = false;
            hand[i + 2].considered = false;
            i += 3
        }
        i += 1
    }
    return sets
}

async function parsePairs(hand, blocks, pairs) {
    let i = 0
    while (i < hand.length - 1) {
        if(hand[i + 1].number === hand[i].number && hand[i].considered === true && hand[i + 1].considered === true) {
            let pair = []
            pair.push({ number: hand[i].number, isSeq: false, isTriple: false, isPair: true, isPartial: false})
            pair.push({ number: hand[i + 1].number, isSeq: false, isTriple: false, isPair: true, isPartial: false})
            blocks.push(pair)
            pairs += 1
            hand[i].considered = false
            hand[i + 1].considered = false
            i += 2
        }
        i += 1
    }
    return pairs
}

async function parsePartials(hand, blocks, partials) {
    let i = 0
    while (i < hand.length - 1) {
        let s2 = binarySearch(hand, hand[i].number + 1, i, hand.length - 1);
        let s3 = binarySearch(hand, hand[i].number + 2, i, hand.length - 1);
        if(s2 !== -1 && s3 === -1 && hand[i].considered === true && hand[s2].considered === true) {
            let seq = []
            seq.push({ number: hand[i].number, isSeq: false, isTriple: false, isPair: false, isPartial: true})
            seq.push({ number: hand[s2].number, isSeq: false, isTriple: false, isPair: false, isPartial: true})
            blocks.push(seq)
            partials += 1
            hand[i].considered = false
            hand[s2].considered = false
            i += 2
        }
        else if(s2 === -1 && s3 !== -1 && hand[i].considered === true && hand[s3].considered === true) {
            let seq = []
            seq.push({ number: hand[i].number, isSeq: false, isTriple: false, isPair: false, isPartial: true})
            seq.push({ number: hand[s3].number, isSeq: false, isTriple: false, isPair: false, isPartial: true})
            blocks.push(seq)
            partials += 1
            hand[i].considered = false
            hand[s3].considered = false
            i += 2
        }
        i += 1
    }
    return partials
}

// A compare function that compares the number property of two objects
function compareByNumber(a, b) {
    return a.number - b.number;
  }

async function parseHand(hand, interaction) {
    tiles = {};
    tileNumbers = [];

    for(let i = 0; i < hand.length; i++) {
        if(hand[i] === 'm') {
            tileNumbers.sort(compareByNumber);
            tiles['man'] = tileNumbers;
            tileNumbers = [];
        }
        else if(hand[i] === 'p') {
            tileNumbers.sort(compareByNumber);
            tiles['pin'] = tileNumbers;
            tileNumbers = [];
        }
        else if(hand[i] === 's') {
            tileNumbers.sort(compareByNumber);
            tiles['sou'] = tileNumbers;
            tileNumbers = [];
        }        
        else if(hand[i] === 'h') {
            tileNumbers.sort(compareByNumber);
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
            let tile = {
                number: number,
                considered: true
            };
            tileNumbers.push(tile)
        }
        else {
            await interaction.editReply({ content: `Warning invalid input. has to use the values 1 - 9 and alpha symbols m, p, s, r and h. Being man, pin, sou, red, and honor tiles respectively. Note that honor tile have the range 1 - 7.`, ephemeral: true });
        }
    }

    return tiles;
}

function calculateShanten(len, sets, pairs, partials) {
    let shanten = Math.min(8 - 2 * sets - (pairs + partials), 6 - pairs)
    return shanten;
}