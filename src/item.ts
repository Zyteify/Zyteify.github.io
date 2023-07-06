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
    stat: string
    affix: PrefixorSuffix;
    tier: number;
    modFamily: string;
    tags: string;
}

type StatList = {
    gear: GearType;
    stats: Stat[];
}

function rollRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



let chanceStatMin = 0.5;
let chanceStatMax = 0.5;

function generateAffixes(rarity: RarityType, gear: GearType): Stat[] {

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
        //get the list of affixes that are prefixes
        let prefixList = affixList.filter(affix => affix.affix == "Prefix");
        //get the list of affixes that are prefixes with the same gear type
        let prefixGearList = prefixList.filter(affix => affix.gearType == gear || affix.gearType == 'ANY');
        //get a single prefix from the list using the affix weights
        let prefix = getAffix(prefixGearList, stats);
        //roll the value of the stat
        let value = rollRange(prefix.valueMin, prefix.valueMax);
        //create the stat
        let stat: Stat = {
            name: prefix.name,
            valueRange: [prefix.valueMin, prefix.valueMax],
            value: value,
            stat: prefix.stat,
            affix: prefix.affix,
            tier: prefix.tier,
            modFamily: prefix.modFamily,
            tags: prefix.tags,
        }
        stats.push(stat);

    }

    for (let i = 0; i < numSuffixes; i++) {
        //get the list of affixes that are suffixes
        let SuffixList = affixList.filter(affix => affix.affix == "Suffix");
        //get the list of affixes that are suffixes with the same gear type
        let suffixGearList = SuffixList.filter(affix => affix.gearType == gear || affix.gearType == 'ANY');
        //get a single suffix from the list using the affix weights
        let suffix = getAffix(suffixGearList, stats);
        //roll the value of the stat
        let value = rollRange(suffix.valueMin, suffix.valueMax);
        //create the stat
        let stat: Stat = {
            name: suffix.name,
            valueRange: [suffix.valueMin, suffix.valueMax],
            value: value,
            stat: suffix.stat,
            affix: suffix.affix,
            tier: suffix.tier,
            modFamily: suffix.modFamily,
            tags: suffix.tags,
        }
        stats.push(stat);
    }


    return stats;
}

let showFullItems = true;
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
if (showFullItems) {
    displayButton.innerHTML = "Show Short Items";
}
else {
    displayButton.innerHTML = "Show Full Items";
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

        //set the item div class

        this.div.id = "gear-div" + this.id.toString();
        this.div.className = "gear-div";
        this.div.draggable = true;
        this.div.classList.add("item");

        //create a short item div
        this.shortDiv = document.createElement('div');



        //by default make the parent container the crafting window
        this.container = document.getElementById('crafting-item-section') as HTMLDivElement;

        this.setupDiv()
        this.setParentDiv()
    }



    setParentDiv(parent?: HTMLDivElement) {

        //remove the div from the current parent

        if (this.div.parentElement != null) {
            this.div.parentElement.removeChild(this.div);
        }
        if (parent == null) {
            parent = gearListContainer
        }
        this.container = parent;

        this.container.appendChild(this.div);

    }

    resetDiv() {
        //destory the div and resetup div
        removeAllChildren(this.div);
        this.setup = false
        this.setupDiv();
    }



    setupDiv() {

        if (!this.setup) {
            this.setup = true;







            //create an item picture div
            const itemPictureDiv = document.createElement('div');
            //set the item picture div class
            itemPictureDiv.classList.add("item-pictureDiv");


            this.div.appendChild(itemPictureDiv);

            if (showFullItems) {

                //create an item name div
                const itemNameDiv = document.createElement('div');
                //set the item name div class
                itemNameDiv.classList.add("item-nameDiv");
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
                this.div.appendChild(itemRarityDiv);
                this.div.appendChild(itemGearDiv);
                this.div.appendChild(itemStatsDiv);

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


                //for each stat
                let numAffixes = this.prefixes.length + this.suffixes.length;
                for (let i = 0; i < numAffixes; i++) {

                    let affix;
                    let affixText = "";
                    //if looking at a prefix
                    if (i < this.prefixes.length) {
                        affix = this.prefixes[i];
                        affixText = "P";
                    }
                    //if looking at a suffix
                    else {
                        affix = this.suffixes[i - this.prefixes.length];
                        affixText = "S";
                    }

                    //create a div for the stat
                    let statDiv = document.createElement('div');
                    statDiv.classList.add("item-statDiv");
                    statDiv.classList.add("small-margin");
                    itemStatDiv.push(statDiv);

                    //set the item stats
                    let statAffix = document.createElement('p');
                    statAffix.classList.add("item-stat-affix");
                    statAffix.classList.add("small-margin");
                    //add a newline between tier and name
                    statAffix.innerHTML = `(${affixText}${affix.tier})<br>(${affix.name})`
                    statAffix.dataset.stat = affix.tags;
                    statAffix.dataset.affix = `${affix.affix}`;
                    itemStatAffix.push(statAffix);
                    ;

                    let stat = document.createElement('p');
                    stat.classList.add("item-stat");
                    stat.classList.add("small-margin");
                    stat.innerHTML = `${affix.value} ${affix.stat}`;
                    stat.dataset.stat = affix.tags;
                    stat.dataset.affix = `${affix.affix}`;
                    itemStat.push(stat);

                }


                for (let i = 0; i < itemStat.length; i++) {
                    itemStatDiv[i].appendChild(itemStatAffix[i]);
                    itemStatDiv[i].appendChild(itemStat[i]);

                }

                for (let i = 0; i < itemStatDiv.length; i++) {
                    itemStatsDiv.appendChild(itemStatDiv[i]);
                }

                let itemName = document.createElement('p');
                itemName.classList.add("item-name");
                itemName.innerHTML = `${this.rarity} ${this.baseType} ${this.gear}`;
                itemNameDiv.appendChild(itemName);

            }



            //set the item picture
            let itemPicture = document.createElement('img');
            itemPicture.classList.add("item-picture");
            let itempicture = this.gear.toLocaleLowerCase();
            itemPicture.src = `../dist/img/${itempicture}.png`;
            itemPicture.draggable = false;
            itemPictureDiv.appendChild(itemPicture);







        }
    }


}

function removeAllChildren(node: Node) {
    while (node.firstChild) {
        removeAllChildren(node.firstChild);
        node.removeChild(node.firstChild);
    }
}

//add a delete div to the gear div
deleteDiv.id = "delete-div";
deleteDiv.className = "delete-div";
deleteDiv.draggable = false;
deleteDiv.innerHTML = "Delete";
