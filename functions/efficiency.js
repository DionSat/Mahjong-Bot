function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

module.exports = async (interaction, hand) => {
    //There need to be 4 sequences/triplets and a double for there to be a basic yaku
    let tiles = await parseHand(hand, interaction)
    let blocks = []
    let sevenPairBlocks = []
    let orphansBlocks = []
    let groups = 0;
    let tripleSets = 0
    let seqSets = 0
    let honorPairs = 0
    let tempPairs = 0
    let pairs = 0;
    let partials = 0;
    let totalPairs = 0
    let suitPairs = 0
    let len = 0
    let teriminals = 0
    let tempTerminals = 0
    for(let k in tiles) {
        let checkSevenTiles = tiles[k].map(a => {return {...a}})
        let checkOrphanTiles = tiles[k].map(a => {return {...a}})
        len += tiles[k].length
        if(k === 'honor') {
            honorPairs = await parsePairs(tiles[k], blocks, honorPairs)
            tempTerminals = await parseHonorTerminals(tiles[k], orphansBlocks, tempTerminals)
        }
        else {
            console.log(tiles[k]);
            seqSets = await parseSequences(tiles[k], blocks, seqSets)
            tripleSets = await parseTriplets(tiles[k], blocks, tripleSets)
            tempPairs = await parsePairs(tiles[k], blocks, tempPairs)
            partials = await parsePartials(tiles[k], blocks, partials)
            tempTerminals = await parseTerminals(checkOrphanTiles, orphansBlocks, tempTerminals)
        }
        suitPairs = await parseTotalPairs(checkSevenTiles, sevenPairBlocks, suitPairs)
        groups += seqSets + tripleSets
        pairs += honorPairs + tempPairs
        totalPairs += suitPairs + honorPairs
        teriminals += tempTerminals
        seqSets = 0
        tripleSets = 0
        tempPairs = 0
        suitPairs = 0
        tempTerminals = 0
    }
    console.log("Blocks: ", blocks);
    let shantenNormalScore = calculateNormalShanten(len, groups, pairs, partials);
    let shanten = Math.min(shantenNormalScore, 6 - totalPairs, 13 - terminals)
    console.log("Shanten: ", shanten);
}

async function parseSequences(hand, blocks, sets) {
    for(let i = 0; i < hand.length; i++) {
        let s2 = binarySearch(hand, hand[i].number + 1, i, hand.length - 1);
        let s3 = binarySearch(hand, hand[i].number + 2, i, hand.length - 1);
        if(s2 !== -1 && s3 !== -1 && hand[i].considered === true && hand[s2].considered === true && hand[s3].considered === true) {
            let seq = []
            seq.push({ number: hand[i].number, isSeq: true, isTriple: false, isPair: false, isPartial: false, isTerminal: false})
            seq.push({ number: hand[s2].number, isSeq: true, isTriple: false, isPair: false, isPartial: false, isTerminal: false})
            seq.push({ number: hand[s3].number, isSeq: true, isTriple: false, isPair: false, isPartial: false, isTerminal: false})
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
            seq.push({ number: hand[i].number, isSeq: false, isTriple: true, isPair: false, isPartial: false, isTerminal: false})
            seq.push({ number: hand[i + 1].number, isSeq: false, isTriple: true, isPair: false, isPartial: false, isTerminal: false})
            seq.push({ number: hand[i + 2].number, isSeq: false, isTriple: true, isPair: false, isPartial: false, isTerminal: false})
            blocks.push(seq)
            sets += 1
            hand[i].considered = false;
            hand[i + 1].considered = false;
            hand[i + 2].considered = false;
            i += 3
        }
        else {
            i += 1
        }
    }
    return sets
}

async function parsePairs(hand, blocks, pairs) {
    let i = 0
    while (i < hand.length - 1) {
        if(hand.length == 2) {
            if(hand[i + 1].number === hand[i].number) {
                let pair = []
                pair.push({ number: hand[i].number, isSeq: false, isTriple: false, isPair: true, isPartial: false, isTerminal: false})
                pair.push({ number: hand[i + 1].number, isSeq: false, isTriple: false, isPair: true, isPartial: false, isTerminal: false})
                blocks.push(pair)
                pairs += 1
                hand[i].considered = false
                hand[i + 1].considered = false
                break
            }
            else {
                break
            }
        }
        let s2 = binarySearch(hand, hand[i].number, i + 1, hand.length - 1);
        if(s2 !== -1 && hand[s2].number === hand[i].number && hand[i].considered === true && hand[s2].considered === true) {
            let pair = []
            pair.push({ number: hand[i].number, isSeq: false, isTriple: false, isPair: true, isPartial: false, isTerminal: false})
            pair.push({ number: hand[i + 1].number, isSeq: false, isTriple: false, isPair: true, isPartial: false, isTerminal: false})
            blocks.push(pair)
            pairs += 1
            hand[i].considered = false
            hand[i + 1].considered = false
            i += 2
        }
        else {
            i += 1
        }
    }
    return pairs
}

async function parseTotalPairs(hand, blocks, pairs) {
    let i = 0
    while (i < hand.length - 1) {
        if(hand.length == 2) {
            if(hand[i + 1].number === hand[i].number) {
                let pair = []
                pair.push({ number: hand[i].number, isSeq: false, isTriple: false, isPair: true, isPartial: false, isTerminal: false})
                pair.push({ number: hand[i + 1].number, isSeq: false, isTriple: false, isPair: true, isPartial: false, isTerminal: false})
                blocks.push(pair)
                pairs += 1
                hand[i].considered = false
                hand[i + 1].considered = false
                break
            }
            else {
                break
            }
        }
        let s2 = binarySearch(hand, hand[i].number, i + 1, hand.length - 1);
        if(s2 !== -1 && hand[s2].number === hand[i].number && hand[i].considered === true && hand[s2].considered === true) {
            let pair = []
            pair.push({ number: hand[i].number, isSeq: false, isTriple: false, isPair: true, isPartial: false, isTerminal: false})
            pair.push({ number: hand[i + 1].number, isSeq: false, isTriple: false, isPair: true, isPartial: false, isTerminal: false})
            blocks.push(pair)
            pairs += 1
            hand[i].considered = false
            hand[i + 1].considered = false
            i += 2
        }
        else {
            i += 1
        }
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
            seq.push({ number: hand[i].number, isSeq: false, isTriple: false, isPair: false, isPartial: true, isTerminal: false})
            seq.push({ number: hand[s2].number, isSeq: false, isTriple: false, isPair: false, isPartial: true, isTerminal: false})
            blocks.push(seq)
            partials += 1
            hand[i].considered = false
            hand[s2].considered = false
            i += 2
        }
        else if(s2 === -1 && s3 !== -1 && hand[i].considered === true && hand[s3].considered === true) {
            let seq = []
            seq.push({ number: hand[i].number, isSeq: false, isTriple: false, isPair: false, isPartial: true, isTerminal: false})
            seq.push({ number: hand[s3].number, isSeq: false, isTriple: false, isPair: false, isPartial: true, isTerminal: false})
            blocks.push(seq)
            partials += 1
            hand[i].considered = false
            hand[s3].considered = false
            i += 2
        }
        else {
            i += 1
        }
    }
    return partials
}

async function parseTerminals(hand, blocks, terms) {
    let i = 0
    let one = false
    let nine = false
    for(i = 0; i < hand.length; i++) {
        if(hand[i].number === 1 && one === false) {
            let seq = []
            seq.push({ number: hand[i].number, isSeq: false, isTriple: true, isPair: false, isPartial: false, isTerminal: true})
            blocks.push(seq)
            one = true
            terms += 1
        }
        else if(hand[i].number === 9 && nine === false) {
            let seq = []
            seq.push({ number: hand[i].number, isSeq: false, isTriple: true, isPair: false, isPartial: false, isTerminal: true})
            blocks.push(seq)
            nine = true
            terms += 1
        }
    }
    return terms
}

async function parseHonorTerminals(hand, blocks, terms) {
    let i = 0
    let counts = []
    for(i = 0; i < hand.length; i++) {
        if(counts[hand[i].number] == undefined) {
            counts[hand[i].number] = 1;
            let seq = []
            seq.push({ number: hand[i].number, isSeq: false, isTriple: true, isPair: false, isPartial: false, isTerminal: true})
            blocks.push(seq)
            terms++;
        }
    }
    return terms
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

function calculateNormalShanten(len, groups, pairs, partials) {
    // let shanten = Math.min(8 - 2 * groups - Math.max(pairs + partials, Math.floor(len / 3) - groups) - Math.min(1, Math.max(0, pairs + partials - (4 - groups))), 6 - pairs)
    let constant = 8
    let diff = 0
    if(groups > 0) {
        if(pairs > 0) {
            diff += 1
            pairs--
        }
        if(groups < 5) {
            diff += (2 * groups)
            if(partials + pairs > (4 - groups)) {
                diff += (4 - groups)
            }
            else {
                diff += partials + pairs
            }
        }
        else if (sets > 4) {
            diff += 8
        }
    }
    else {
        if(pairs > 0) {
            diff += 1
            pairs--
        }
        if(partials + pairs > 4) {
            diff += 4
        }
        else if (partials + pairs < 5) {
            diff += partials + pairs
        }
    }
    let shanten = constant - diff
    return shanten
}