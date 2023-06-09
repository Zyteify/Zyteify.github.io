"use strict";
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
const itemTypes = ["Weapon", "Boot"];
const gearTypes = [
    "Spade",
    //"Mace",
    "Potion",
    "Hammer",
    //"Knife",
    "Spear",
    "Chisel",
    "Quill",
    "Dice",
    //"Scales",
    //"Holy Symbol",
    //"Scroll",
    "Pickaxe",
    "Axe",
];
const vocationMap = {
    'Spade': 'Farmer',
    'Mace': 'Guard',
    'Potion': 'Nurse',
    'Hammer': 'Blacksmith',
    'Knife': 'Cook',
    'Spear': 'Hunter',
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
let baseTypeChanceSilver = 0.05;
let baseTypeChanceGold = 0.01;
function generateRarity() {
    let rarity = "Common";
    let totalChance = rarityChanceCommon + rarityChanceMagic + rarityChanceRare + rarityChanceUnique;
    let random = Math.random() * totalChance;
    //generate a random number between 0 and 
    switch (true) {
        case (random < rarityChanceCommon):
            rarity = 'Common';
            break;
        case (random < rarityChanceCommon + rarityChanceMagic):
            rarity = 'Magic';
            break;
        case (random < rarityChanceCommon + rarityChanceMagic + rarityChanceRare):
            rarity = 'Rare';
            break;
        case (random < rarityChanceCommon + rarityChanceMagic + rarityChanceRare + rarityChanceUnique):
            rarity = 'Unique';
            break;
        default:
            rarity = 'Common';
            console.log('error chances in generateRarity');
            break;
    }
    return rarity;
}
function generateBaseType(gearType) {
    let baseType = baseTypes[0];
    let totalChance = baseTypeChanceWooden + baseTypeChanceCopper + baseTypeChanceSilver + baseTypeChanceGold;
    let random = Math.random() * totalChance;
    //generate a random number between 0 and 
    let myBaseType = null;
    switch (true) {
        case (random < baseTypeChanceWooden):
            myBaseType = findBaseTypeByNameandGearType("Wooden", gearType);
            break;
        case (random < baseTypeChanceWooden + baseTypeChanceCopper):
            myBaseType = findBaseTypeByNameandGearType("Copper", gearType);
            break;
        case (random < baseTypeChanceWooden + baseTypeChanceCopper + baseTypeChanceSilver):
            myBaseType = findBaseTypeByNameandGearType("Silver", gearType);
            break;
        case (random < baseTypeChanceWooden + baseTypeChanceCopper + baseTypeChanceSilver + baseTypeChanceGold):
            myBaseType = findBaseTypeByNameandGearType("Gold", gearType);
            break;
        default:
            myBaseType = findBaseTypeByNameandGearType("Wooden", gearType);
            console.log('error chances in generateBaseType');
            break;
    }
    if (myBaseType) {
        baseType = myBaseType;
    }
    return baseType;
}
function generateGear() {
    let gear = "Spade";
    let random = Math.random() * gearTypes.length;
    //set gear to a random gear type
    gear = gearTypes[Math.floor(random)];
    return gear;
}
function rollRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let chanceStatMin = 0.5;
let chanceStatMax = 0.5;
function generateAffixes(rarity, gear) {
    let stats = [];
    /* stats.push(stat); */
    let numPrefixes = 0;
    let numSuffixes = 0;
    let totalChance = chanceStatMin + chanceStatMax;
    let random = Math.random() * totalChance;
    //get the number of stats to generate
    switch (rarity) {
        case "Starter":
            break;
        case "Common":
            numPrefixes = 0;
            numSuffixes = 0;
            break;
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
            break;
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
            break;
        case "Unique":
            console.log(`shouldnt be generating stats for unique gear`);
            break;
        default:
            console.log(`error in generateAffixes`);
            break;
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
        let stat = {
            name: prefix.name,
            valueRange: [prefix.valueMin, prefix.valueMax],
            value: value,
            stat: prefix.stat,
            affix: prefix.affix,
            tier: prefix.tier,
            modFamily: prefix.modFamily,
            tags: prefix.tags,
            modified: false,
            itemMod: {
                modName: prefix.modName,
                modValue: value,
            }
        };
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
        let stat = {
            name: suffix.name,
            valueRange: [suffix.valueMin, suffix.valueMax],
            value: value,
            stat: suffix.stat,
            affix: suffix.affix,
            tier: suffix.tier,
            modFamily: suffix.modFamily,
            tags: suffix.tags,
            modified: false,
            itemMod: {
                modName: suffix.modName,
                modValue: value,
            }
        };
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
function removeAllChildren(node) {
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
function createRandomGear() {
    let randomGearType = gearTypes[Math.floor(Math.random() * gearTypes.length)];
    let randomItemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    //set it to weapon for now while we only have weapons
    randomItemType = "Weapon";
    //create a new worker
    let gearCreation = createGear(randomItemType, randomGearType);
    if (gearCreation) {
        craftWork -= craftingCosts.craftingWork;
        updateCraftButton();
        controlCraftingButtons();
    }
    return gearCreation;
}
function createSelectedGear() {
    let baseTypeName = materialsItemDropdown.value;
    let gearType = materialsGearDropdown.value;
    let baseType = findBaseTypeByNameandGearType(baseTypeName, gearType);
    if (baseType) {
        let gearCreation = createGear("Weapon", gearType, baseType);
        if (gearCreation) {
            craftWork -= craftingCosts.craftingWork;
            updateCraftButton();
            controlCraftingButtons();
        }
        return gearCreation;
    }
    else {
        console.log(`error in createSelectedGear, baseType not found, baseTypeName: ${baseTypeName}, gearType: ${gearType}`);
        return false;
    }
}
function createGear(itemType, gearType, baseType, rarity) {
    let location;
    let locationDiv;
    //starter gear goes directly into inventory
    if (rarity == 'Starter') {
        location = items;
        locationDiv = gearListContainer;
    }
    else {
        location = craftingItems;
        locationDiv = craftingItemSectionDiv;
    }
    let gear = gearType;
    if (!gear) {
        gear = generateGear();
    }
    if (!baseType) {
        baseType = generateBaseType(gear);
    }
    if (!rarity) {
        rarity = generateRarity();
    }
    //if the location to put the new item is items and the player has room for it and the player has the resources, create the item
    let locationHasRoom = false;
    if (location == items) {
        locationHasRoom = roomAvailable(items);
    }
    else if (location == craftingItems) {
        locationHasRoom = roomAvailable(craftingItems);
    }
    let resourceCostSuccess = false;
    if (baseType.resource.length == 0) {
        resourceCostSuccess = true;
    }
    //able to pay the resources?
    for (let i = 0; i < baseType.resource.length; i++) {
        let resource = getResourceByName(baseType.resource[i]);
        if (resource) {
            if (resource.amount >= baseType.resourceCost[i]) {
                resourceCostSuccess = true;
            }
            else {
                resourceCostSuccess = false;
                break;
            }
        }
        else {
            console.log(`error in createGear, resource not found, resource: ${baseType.resource[i]}`);
            resourceCostSuccess = false;
            break;
        }
    }
    if (locationHasRoom && resourceCostSuccess) {
        //pay the resources
        for (let i = 0; i < baseType.resource.length; i++) {
            let resource = getResourceByName(baseType.resource[i]);
            if (resource) {
                resource.amount -= baseType.resourceCost[i];
            }
            else {
                console.log(`error in createGear, resource not found, resource: ${baseType.resource[i]}`);
                break;
            }
        }
        let newGear = new Item(itemType, baseType, rarity);
        newGear.setParentDiv(locationDiv);
        location.push(newGear);
        displayText();
        controlCraftingButtons();
        displayGear();
        return true;
    }
    else {
        if (!locationHasRoom) {
            if (location == items) {
                console.log(`failed to create gear, gear count current: ${items.length}, gear count max: ${game.gearCountMax}`);
            }
            else {
                console.log(`failed to create gear, crafting items current: ${craftingItems.length}, crafting items max: ${craftingItemsMax}`);
            }
        }
        else if (!resourceCostSuccess) {
            console.log(`failed to create gear, not enough resources`);
        }
        return false;
    }
}
//add a button in the item options to delete the item
let deleteButton = document.createElement('button');
deleteButton.innerHTML = "Delete";
deleteButton.onclick = function () {
    deleteItem();
};
craftingOptionsDiv.appendChild(deleteButton);
//add a button in the item options to add the item to gear
let addToGearButton = document.createElement('button');
addToGearButton.innerHTML = "Add to Gear";
addToGearButton.onclick = function () {
    addToGear();
};
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
    controlCraftingButtons();
}
function addToGear() {
    if (roomAvailable(items)) {
        //get the item from the crafting items list
        let item = craftingItems[0];
        //remove the item from the crafting items list
        craftingItems.splice(0, 1);
        //set the parent div to the gear list
        item.setParentDiv(gearListContainer);
        item.resetDiv();
        //add the item to the items list
        items.push(item);
        //update the crafting button
        updateCraftButton();
        controlCraftingButtons();
    }
    else {
        console.log(`failed to add to gear, gear count current: ${items.length}, gear count max: ${game.gearCountMax}`);
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
