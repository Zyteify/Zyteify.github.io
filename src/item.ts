type GearType = "Hoe" | "Mace" | "Potion" | "Hammer" | "Knife" | "Bow" | "Chisel" | "Quill" | "Dice" | "Scales" | "Holy Symbol" | "Scroll" | "Pickaxe" | "Axe";
type ItemType = "Weapon" | "Boot"
type BaseType = "Wooden" | "Copper" | "Bronze" | "Iron" | "Gold"

type RarityType = "Starter" | "Common" | "Magic" | "Rare" | "Unique"

const itemTypes: ItemType[] = ["Weapon", "Boot"]

const gearTypes: GearType[] = [
    "Hoe",
    //"Mace",
    "Potion",
    "Hammer",
    //"Knife",
    "Bow",
    "Chisel",
    "Quill",
    "Dice",
    //"Scales",
    //"Holy Symbol",
    //"Scroll",
    "Pickaxe",
    "Axe",
];

const vocationMap: Record<GearType, ClassType> = {
    'Hoe': 'Farmer',
    'Mace': 'Guard',
    'Potion': 'Nurse',
    'Hammer': 'Blacksmith',
    'Knife': 'Cook',
    'Bow': 'Hunter',
    'Chisel': 'Gemcutter',
    'Quill': 'Taxer',
    'Dice': 'Gambler',
    'Scales': 'Taxer',
    'Holy Symbol': 'Priest',
    'Scroll': 'Researcher',
    'Pickaxe': 'Miner',
    'Axe': 'Woodcutter',
};

let rarityChanceCommon = 0.8;
let rarityChanceMagic = 0.5;
let rarityChanceRare = 0.2;
let rarityChanceUnique = 0.00;

let baseTypeChanceWooden = 0.8;
let baseTypeChanceCopper = 0.5;
let baseTypeChanceBronze = 0.2;
let baseTypeChanceIron = 0.05;
let baseTypeChanceGold = 0.01;



function generateRarity(): RarityType {
    let rarity: RarityType = "Common";

    let totalChance = rarityChanceCommon + rarityChanceMagic + rarityChanceRare + rarityChanceUnique;
    let random = Math.random() * totalChance;
    //generate a random number between 0 and 

    switch (true) {
        case (random < rarityChanceCommon):
            rarity = 'Common'
            break;
        case (random < rarityChanceCommon + rarityChanceMagic):
            rarity = 'Magic'
            break;
        case (random < rarityChanceCommon + rarityChanceMagic + rarityChanceRare):
            rarity = 'Rare'
            break;
        case (random < rarityChanceCommon + rarityChanceMagic + rarityChanceRare + rarityChanceUnique):
            rarity = 'Unique'
            break;
        default:
            rarity = 'Common'
            console.log('error chances in generateRarity');
            break;
    }
    return rarity;
}

function generateBaseType(): BaseType {
    let baseType: BaseType = "Wooden";

    let totalChance = baseTypeChanceWooden + baseTypeChanceCopper + baseTypeChanceBronze + baseTypeChanceIron + baseTypeChanceGold;
    let random = Math.random() * totalChance;
    //generate a random number between 0 and 

    switch (true) {
        case (random < baseTypeChanceWooden):
            baseType = 'Wooden'
            break;
        case (random < baseTypeChanceWooden + baseTypeChanceCopper):
            baseType = 'Copper'
            break;
        case (random < baseTypeChanceWooden + baseTypeChanceCopper + baseTypeChanceBronze):
            baseType = 'Bronze'
            break;
        case (random < baseTypeChanceWooden + baseTypeChanceCopper + baseTypeChanceBronze + baseTypeChanceIron):
            baseType = 'Iron'
            break;
        case (random < baseTypeChanceWooden + baseTypeChanceCopper + baseTypeChanceBronze + baseTypeChanceIron + baseTypeChanceGold):
            baseType = 'Gold'
            break;
        default:
            baseType = 'Wooden'
            console.log('error chances in generateRarity');
            break;
    }
    return baseType;
}

function generateGear(): GearType {
    let gear: GearType = "Hoe";

    let random = Math.random() * gearTypes.length;

    //set gear to a random gear type
    gear = gearTypes[Math.floor(random)];

    return gear;
}

type PrefixorSuffix = "Prefix" | "Suffix";

type Stat = {
    name: string;
    valueRange: number[];
    value: number;
    affix: PrefixorSuffix;
}

type StatList = {
    gear: GearType;
    stats: Stat[];
}

//create an example stat
let prefix1: Stat = {
    name: "prefix1",
    valueRange: [1, 10],
    value: 1,
    affix: "Prefix"
}

//create another example stat
let prefix2: Stat = {
    name: "prefix2",
    valueRange: [11, 20],
    value: 2,
    affix: "Prefix"
}

//create another example stat
let prefix3: Stat = {
    name: "prefix3",
    valueRange: [21, 30],
    value: 3,
    affix: "Prefix"
}

//create an example stat list
let prefixList: StatList = {
    gear: "Hoe",
    stats: []
}

//add the example stats to the example stat list
prefixList.stats.push(prefix1);
prefixList.stats.push(prefix2);
prefixList.stats.push(prefix3);

//create an example stat
let suffix1: Stat = {
    name: "suffix1",
    valueRange: [1, 10],
    value: 1,
    affix: "Suffix"
}

//create another example stat
let suffix2: Stat = {
    name: "suffix2",
    valueRange: [11, 20],
    value: 2,
    affix: "Suffix"
}

//create another example stat
let suffix3: Stat = {
    name: "suffix3",
    valueRange: [21, 30],
    value: 3,
    affix: "Suffix"
}

//create an example stat list
let suffixList: StatList = {
    gear: "Hoe",
    stats: []
}

//add the example stats to the example stat list
suffixList.stats.push(suffix1);
suffixList.stats.push(suffix2);
suffixList.stats.push(suffix3);

function rollRange(range: number[]): number {
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}



let chanceStatMin = 0.5;
let chanceStatMax = 0.5;

function generateAffixes(rarity: RarityType, gear: GearType): Stat[] {
    let stat: Stat = {
        name: "Default",
        valueRange: [1, 1],
        value: 1,
        affix: "Prefix"
    }

    let stats: Stat[] = [];
    /* stats.push(stat); */

    let numPrefixes = 0;
    let numSuffixes = 0;
    let totalChance = chanceStatMin + chanceStatMax
    let random = Math.random() * totalChance;
    //get the number of stats to generate
    switch (rarity) {
        case "Starter":
            console.log(`shouldnt be generating stats for start gear`);
            break
        case "Common":
            numPrefixes = 0;
            numSuffixes = 0;
            break
        case "Magic":
            if (random < chanceStatMin) {
                if (Math.random() < 0.5) {
                    numPrefixes = 1;
                    numSuffixes = 0;
                }
                else {
                    numPrefixes = 0;
                    numSuffixes = 1;
                }
            }
            else {
                numPrefixes = 1;
                numSuffixes = 1;
            }
            break
        case "Rare":
            if (random < chanceStatMin) {
                if (Math.random() < 0.5) {
                    numPrefixes = 2;
                    numSuffixes = 1;
                }
                else {
                    numPrefixes = 1;
                    numSuffixes = 2;
                }
            }
            else {
                numPrefixes = 2;
                numSuffixes = 2;
            }
            break
        case "Unique":
            console.log(`shouldnt be generating stats for unique gear`);
            break
        default:
            console.log(`error in generateAffixes`);
            break
    }


    //generate the stats
    for (let i = 0; i < numPrefixes; i++) {
        //select a random prefix from the stat list
        let randomStat = Math.floor(Math.random() * prefixList.stats.length);
        let prefix = Object.assign({}, prefixList.stats[randomStat]);
        prefix.value = rollRange(prefix.valueRange);
        stats.push(prefix)
    }

    for (let i = 0; i < numSuffixes; i++) {
        //select a random prefix from the stat list
        let randomStat = Math.floor(Math.random() * suffixList.stats.length);
        let suffix = Object.assign({}, suffixList.stats[randomStat]);
        suffix.value = rollRange(suffix.valueRange);
        stats.push(suffix)
    }


    return stats;
}

let showFullItems = false;
//create button to switch from short to long display
const displayButton = document.createElement('button');
displayButton.id = "display-button";
displayButton.className = "display-button";
displayButton.draggable = false;
displayButton.innerHTML = "Show Full Items";
displayButton.onclick = function () {
    if (showFullItems) {
        displayButton.innerHTML = "Show Short Items";
    }
    else {
        displayButton.innerHTML = "Show Full Items";
    }
    showFullItems = !showFullItems;
    displayGear()
}
//attach the button to the gear list
const gearList = document.getElementById('gear') as HTMLDivElement;
gearList.appendChild(displayButton);

class Item {
    id: number;
    type: ItemType;
    gear: GearType;
    image: HTMLImageElement;

    //display
    div: HTMLDivElement;
    shortDiv: HTMLDivElement;
    container: HTMLDivElement;
    baseType: string;
    prefixes: Stat[] = [];
    suffixes: Stat[] = [];
    rarity: RarityType;

    setup: boolean = false;
    setupShort: boolean = false;
    static count: number = 0;
    constructor(type: ItemType, gear?: GearType,
        baseType?: string, rarity?: RarityType
    ) {
        this.id = Item.count++;
        this.type = type;
        if (!gear) {
            gear = generateGear();
        }
        this.gear = gear;

        if (!baseType) {
            baseType = generateBaseType();
        }
        this.baseType = baseType;

        if (!rarity) {
            rarity = generateRarity();
        }
        this.rarity = rarity;

        //generate the affixes
        let affixes = generateAffixes(this.rarity, this.gear);
        for (let i = 0; i < affixes.length; i++) {
            if (affixes[i].affix == "Prefix") {
                this.prefixes.push(affixes[i]);
            }
            else if (affixes[i].affix == "Suffix") {
                this.suffixes.push(affixes[i]);
            }
        }



        this.image = new Image();
        //create an item div
        this.div = document.createElement('div');

        //create a short item div
        this.shortDiv = document.createElement('div');

        //by default make the parent container the gear list
        this.container = document.getElementById('gear-list') as HTMLDivElement;

        //this.setupDiv()
        this.setupShortDiv()
        this.setupDiv()
        this.setParentDiv()
    }



    setParentDiv(parent?: HTMLDivElement) {

        //remove the div from the current parent

        if (this.div.parentElement != null) {
            this.div.parentElement.removeChild(this.div);
        }
        if (this.shortDiv.parentElement != null) {
            this.shortDiv.parentElement.removeChild(this.shortDiv);
        }

        if (parent == null) {
            parent = document.getElementById('gear-list') as HTMLDivElement;
        }
        this.container = parent;

        if (showFullItems) {
            this.container.appendChild(this.div);
        }
        else {
            this.container.appendChild(this.shortDiv);
        }
    }


    setupShortDiv() {
        if (!this.setupShort) {
            this.setupShort = true;

            //set the item div class

            this.shortDiv.id = "gear-div" + this.id.toString();
            this.shortDiv.className = "gear-div";
            this.shortDiv.draggable = true;
            this.shortDiv.classList.add("item");

            //create an item name div
            const itemNameDiv = document.createElement('div');
            //set the item name div class
            itemNameDiv.classList.add("item-nameDiv");
            //create an item picture div
            const itemPictureDiv = document.createElement('div');
            //set the item picture div class
            itemPictureDiv.classList.add("item-pictureDiv");

            let itemName = document.createElement('p');
            itemName.classList.add("item-name");
            itemName.innerHTML = `${this.rarity} ${this.baseType} ${this.gear}`;
            itemNameDiv.appendChild(itemName);

            //set the item picture
            let itemPicture = document.createElement('img');
            itemPicture.classList.add("item-picture");
            let itempicture = this.gear.toLocaleLowerCase();
            itemPicture.src = `../dist/img/${itempicture}.png`;
            itemPicture.draggable = false;
            itemPictureDiv.appendChild(itemPicture);

            this.shortDiv.appendChild(itemNameDiv);
            this.shortDiv.appendChild(itemPictureDiv);


        }
    }



    setupDiv() {

        if (!this.setup) {
            this.setup = true;

            //set the item div class

            this.div.id = "gear-div" + this.id.toString();
            this.div.className = "gear-div";
            this.div.draggable = true;
            this.div.classList.add("item");




            //create an item name div
            const itemNameDiv = document.createElement('div');
            //set the item name div class
            itemNameDiv.classList.add("item-nameDiv");
            //create an item picture div
            const itemPictureDiv = document.createElement('div');
            //set the item picture div class
            itemPictureDiv.classList.add("item-pictureDiv");
            //create an item gear div
            const itemGearDiv = document.createElement('div');
            //set the item gear div class
            itemGearDiv.classList.add("item-gearDiv");
            //create an item stats div
            const itemStatsDiv = document.createElement('div');
            //set the item stats div class
            itemStatsDiv.classList.add("item-statsDiv");
            //create an item rarity div
            const itemRarityDiv = document.createElement('div');
            //set the item rarity div class
            itemRarityDiv.classList.add("item-rarityDiv");

            //append the divs to the item div
            this.div.appendChild(itemNameDiv);
            this.div.appendChild(itemPictureDiv);
            this.div.appendChild(itemRarityDiv);
            this.div.appendChild(itemGearDiv);
            this.div.appendChild(itemStatsDiv);



            let itemName = document.createElement('p');
            itemName.classList.add("item-name");
            itemName.innerHTML = `${this.rarity} ${this.baseType} ${this.gear}`;
            itemNameDiv.appendChild(itemName);

            //set the item picture
            let itemPicture = document.createElement('img');
            itemPicture.classList.add("item-picture");
            let itempicture = this.gear.toLocaleLowerCase();
            itemPicture.src = `../dist/img/${itempicture}.png`;
            itemPicture.draggable = false;
            itemPictureDiv.appendChild(itemPicture);

            //set the item rarity
            let itemRarity = document.createElement('p');
            itemRarity.classList.add("item-rarity");
            itemRarity.classList.add("small-margin");
            itemRarity.innerHTML = `${this.rarity}`;
            itemRarityDiv.appendChild(itemRarity);

            //set the item gear
            let itemGear = document.createElement('p');
            itemGear.classList.add("item-gear");
            itemGear.classList.add("small-margin");
            itemGear.innerHTML = `${this.gear}`;
            itemGearDiv.appendChild(itemGear);

            let itemStat = [];
            let itemStatDiv = [];
            let itemStatAffix = [];

            //item stat div
            let stat1Div = document.createElement('div');
            stat1Div.classList.add("item-statDiv");
            stat1Div.classList.add("small-margin");
            itemStatDiv.push(stat1Div);

            let stat2Div = document.createElement('div');
            stat2Div.classList.add("item-statDiv");
            stat2Div.classList.add("small-margin");
            itemStatDiv.push(stat2Div);

            //set the item stats
            let stat1 = document.createElement('p');
            stat1.classList.add("item-stat");
            stat1.classList.add("small-margin");
            stat1.innerHTML = "+100 to attack";
            stat1.dataset.stat = "attack";
            stat1.dataset.affix = "prefix";
            itemStat.push(stat1);

            //set the item stats
            let statafffix1 = document.createElement('p');
            statafffix1.classList.add("item-stat-affix");
            statafffix1.innerHTML = "(P1)";
            statafffix1.classList.add("small-margin");
            itemStatAffix.push(statafffix1);

            let stat2 = document.createElement('p');
            stat2.classList.add("item-stat");
            stat2.classList.add("small-margin");
            stat2.innerHTML = "+100 to Defenceaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaa aaaaaaaaaaaa";
            stat2.dataset.stat = "defense";
            stat2.dataset.affix = "suffix";
            itemStat.push(stat2);

            //set the item stats
            let statafffix2 = document.createElement('p');
            statafffix2.classList.add("item-stat-affix");
            statafffix2.innerHTML = "(S1)";
            statafffix2.classList.add("small-margin");
            itemStatAffix.push(statafffix2);

            for (let i = 0; i < itemStat.length; i++) {
                itemStatDiv[i].appendChild(itemStatAffix[i]);
                itemStatDiv[i].appendChild(itemStat[i]);

            }

            for (let i = 0; i < itemStatDiv.length; i++) {
                itemStatsDiv.appendChild(itemStatDiv[i]);
            }



        }
    }


}

//add a delete div to the gear div
deleteDiv.id = "delete-div";
deleteDiv.className = "delete-div";
deleteDiv.draggable = false;
deleteDiv.innerHTML = "Delete";
