
//set the crafting div inititialisation


//set the item options
let craftingItemOptions = document.createElement('p');
craftingItemOptions.id = "crafting-item-options";
craftingItemOptions.innerHTML = "Item Options";
craftingOptionsDiv.appendChild(craftingItemOptions);

//set the item materials
let craftingItemMaterials = document.createElement('p');
craftingItemMaterials.id = "crafting-item-materials";
craftingItemMaterials.innerHTML = "Item Materials";
craftingMaterialsListDiv.appendChild(craftingItemMaterials);

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

const gearBaseTypeMap: Record<GearType, BaseType[]> = {
    'Hoe': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Mace': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Potion': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Hammer': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Knife': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Bow': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Chisel': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Quill': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Dice': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Scales': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Holy Symbol': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Scroll': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Pickaxe': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
    'Axe': ['Wooden', 'Copper', 'Bronze', 'Iron', 'Gold'],
};

const baseTypeResourceCostMap: Record<BaseType, number> = {
    'Wooden': 5,
    'Copper': 10,
    'Bronze': 100,
    'Iron': 100,
    'Gold': 100,
};

const baseTypeCraftingCostMap: Record<BaseType, number> = {
    'Wooden': 5,
    'Copper': 10,
    'Bronze': 100,
    'Iron': 1000,
    'Gold': 10000,
};

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

/* let showFullItems = true;
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
 */


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






function createRandomGear(): boolean {

    let randomGearType = gearTypes[Math.floor(Math.random() * gearTypes.length)];
    let randomItemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    //set it to weapon for now while we only have weapons
    randomItemType = "Weapon"
    //create a new worker
    let gearCreation = createGear(randomItemType, randomGearType);
    if (gearCreation) {
        craftResource -= craftingCost;
        updateCraftButton();
        controlCraftingButtons()
    }
    return gearCreation;
}


function createGear(itemType: ItemType, GearType: GearType, baseType?: BaseType, rarity?: RarityType): boolean {

    let location;
    let locationDiv;
    //starter gear goes directly into inventory
    if (rarity == 'Starter') {
        location = items
        locationDiv = gearListContainer
    }
    else {
        location = craftingItems
        locationDiv = craftingItemSectionDiv;
    }

    //get the div for the location

    //if the location to put the new item is items and the player has room for it, create the item

    if (
        (location == items && roomAvailable(items))
        || (location == craftingItems && craftingItems.length < craftingItemsMax)) {

        let newGear = new Item(itemType, GearType, baseType, rarity);
        newGear.setParentDiv(locationDiv)

        location.push(newGear);

        displayText();


        if (newGear.gear == "Pickaxe") {
            game.unlockedPickaxe = true;
            setResourceActive(ResourceType.stone);
            setResourceActive(ResourceType.gems);
            setResourceActive(ResourceType.metal);
        }
        controlCraftingButtons()
        displayGear()
        return true
    }
    else {
        if (location == items) {
            
            console.log(`failed to create gear, gear count current: ${items.length}, gear count max: ${game.gearCountMax}`);
        }
        else {
            console.log(`failed to create gear, crafting items current: ${craftingItems.length}, crafting items max: ${craftingItemsMax}`);
        }

        return false
    }

}

function updateCraftButton() {
    //if the player has enough resources, enable the button
    if (craftResource >= craftingCost) {

        unlockCrafting()
        createGearButton.disabled = false;
    }
    else {
        createGearButton.disabled = true;
    }


    //if the crafting button has not been shown yet, show it
    if (!game.unlockedCraftingButton) {
        game.unlockedCraftingButton = true;
        craftingResource.style.display = "block"
        createGearButton.style.display = "block"
    }
}
let craftingCost = 5;

//create-gear
const createGearButton = <HTMLButtonElement>document.getElementById('create-gear');
createGearButton.disabled = true;
createGearButton.innerHTML = `Craft Gear (🔨${craftingCost})`;

//if the craft button is clicked, craft the item
createGearButton.onclick = function () {
    unlockCrafting()
    createRandomGear();
}


//add a button in the item options to delete the item
let deleteButton = document.createElement('button');
deleteButton.innerHTML = "Delete";
deleteButton.onclick = function () {
    deleteItem();
}
craftingOptionsDiv.appendChild(deleteButton);

//add a button in the item options to add the item to gear
let addToGearButton = document.createElement('button');
addToGearButton.innerHTML = "Add to Gear";
addToGearButton.onclick = function () {
    addToGear();
}
craftingOptionsDiv.appendChild(addToGearButton);

//todo add and remove event listeners for the crafting items list
function deleteItem() {
    //get the item from the crafting items list
    let item = craftingItems[0];
    //remove the item from the crafting items list
    craftingItems.splice(0, 1);
    //remove the itemDiv from the crafting item section
    craftingItemSectionDiv.removeChild(item.div);
    //update the crafting button
    updateCraftButton();
    controlCraftingButtons()
}

function addToGear() {
    if (roomAvailable(items)) {
        //get the item from the crafting items list
        let item = craftingItems[0];
        //remove the item from the crafting items list
        craftingItems.splice(0, 1);
        //set the parent div to the gear list
        item.setParentDiv(gearListContainer)
        item.resetDiv();
        //add the item to the items list
        items.push(item);
        //update the crafting button
        updateCraftButton();
        controlCraftingButtons()
    }
    else {
        console.log(`failed to add to gear, gear count current: ${items.length}, gear count max: ${game.gearCountMax}`)
    }
}

function controlCraftingButtons() {
    if (craftingItems.length > 0) {
        deleteButton.disabled = false;
        addToGearButton.disabled = false;
    }
    if (craftingItems.length == 0) {
        deleteButton.disabled = true;
        addToGearButton.disabled = true;
    }
    if (!roomAvailable(items)) {
        addToGearButton.disabled = true;
    }
}
