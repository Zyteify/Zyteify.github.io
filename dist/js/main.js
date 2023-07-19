"use strict";
//list of workers
let workers = [];
//create resources list of initial resources available
let resources = [
    new Resource('food', 0, resourceList),
    new Resource('wood', 0, resourceList),
    new Resource('stone', 0, resourceList),
    new Resource('copper', 0, resourceList),
    new Resource('silver', 0, resourceList),
    new Resource('gold', 0, resourceList),
    new Resource('coins', 1, resourceList),
];
function setResourceActive(name) {
    //set the default resource to be active
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].ResourceType == name) {
            resources[i].active = true;
        }
    }
}
setResourceActive('food');
setResourceActive('coins');
//list of gems  
let gems = [
    new Gem("1", 'gem1.png', 0, false),
    new Gem("2", 'gem2.png', 0, false),
    new Gem("3", 'gem3.png', 0, false),
];
function setGemActive(name) {
    //set the default resource to be active
    for (let i = 0; i < gems.length; i++) {
        if (gems[i].name == name) {
            gems[i].active = true;
        }
    }
}
setGemActive("1");
setGemActive("2");
setGemActive("3");
//convert the number of hours into a time
function convertHoursToTime(hours) {
    let time = "";
    let ampm = "am";
    if (hours >= 12) {
        ampm = "pm";
    }
    if (hours > 12) {
        hours -= 12;
    }
    if (hours == 0) {
        hours = 12;
    }
    time = hours + ampm;
    return time;
}
//list of items
let itemsInventory = [];
function roomAvailable(array) {
    //if the array is the same as items
    if (array == itemsInventory) {
        if (itemsInventory.length < game.gearCountMax) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (array == itemsCrafting) {
        if (itemsCrafting.length < game.craftingItemsMax) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        console.log(`unable to check room available for array ${array}`);
        return true;
    }
}
//list of items
let itemsCrafting = [];
//list of items
let itemsDeleted = [];
function loadJson(url) {
    return fetch(url).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    }).catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}
//load the json data for names
let nameListBoy = [];
loadJson('../dist/data/boy_names.json').then(data => {
    nameListBoy = data.names;
});
//load the json data for names
let NameListGirl = [];
loadJson('../dist/data/girl_names.json').then(data => {
    NameListGirl = data.names;
});
//load the json data for items
let affixList = [];
loadJson('../dist/data/affixes.json').then(data => {
    affixList = data;
});
//todo verify the affixList is indeed an array of affixes at runtime
//this is not checked and may introduce bugs
const baseTypes = [];
//load the json data for basetypes
loadJson('../dist/data/basetypes.json').then(data => {
    let baseTypeListTemp = data;
    //create a basetype for each in the list
    for (let i = 0; i < baseTypeListTemp.length; i++) {
        let baseType = baseTypeListTemp[i];
        let name = baseType.name;
        let gearType = baseType.gearType;
        let gearSlot = baseType.gearSlot;
        let resources = baseType.resources;
        let itemMods = baseType.itemMods;
        let craftingCost = baseType.craftingCost;
        let resourcesTemp = [];
        //create an array for each resource
        if (resources) {
            for (let i = 0; i < resources.length; i++) {
                let resource = new Resource(resources[i].resourceType, resources[i].amount);
                resourcesTemp.push(resource);
            }
        }
        //create an itemMod for the item power
        let newBaseType = new BaseType(name, gearType, gearSlot, resourcesTemp, itemMods, craftingCost);
        baseTypes.push(newBaseType);
    }
    initializeCrafting();
});
//create a few upgrades
let upgrades = [];
//new Upgrade("Unlock Chisel", false, 0, 1, unlockChisel, ["Pickaxe"], ["Chisel"])
//load the json data for basetypes
loadJson('../dist/data/upgrades.json').then(data => {
    let upgradesTemp = data;
    //create a upgrade for each in the list
    for (let i = 0; i < upgradesTemp.length; i++) {
        let name = upgradesTemp[i].name;
        let active = upgradesTemp[i].active;
        let level = upgradesTemp[i].level;
        let maxLevel = upgradesTemp[i].maxLevel;
        let upgradeAction = window[upgradesTemp[i].upgradeAction];
        let requiredUpgrade = upgradesTemp[i].requiredUpgrade;
        let costMultiplier = upgradesTemp[i].costMultiplier;
        //create the upgrade
        let upgrade = new Upgrade(name, active, level, maxLevel, upgradeAction, costMultiplier, requiredUpgrade);
        let resourcesRequired = [];
        for (let j = 0; j < upgradesTemp[i].resourcesRequired.length; j++) {
            let resource = new Resource(upgradesTemp[i].resourcesRequired[j].resourceType, upgradesTemp[i].resourcesRequired[j].amount, upgrade.resourceSpan);
            resource.active = true;
            resourcesRequired.push(resource);
        }
        upgrade.resourcesRequired = resourcesRequired;
        upgrades.push(upgrade);
    }
    displayUpgrades();
});
/* //add the costs to the upgrades
for (let i = 0; i < upgrades.length; i++) {
    let upgrade = <Upgrade>getUpgradeByName(upgrades[i].name)
    switch (upgrade.name) {
        case "Hire Beggar":
            upgrade.addResourceCost(new Resource('coins', 1, upgrade.resourceSpan));
            break
        case "Unlock Gear":
            upgrade.addResourceCost(new Resource('coins', 10, upgrade.resourceSpan));
            break
        case "Hire Worker":
            upgrade.addResourceCost(new Resource('food', 0, upgrade.resourceSpan));
            break
        case "Increase Worker Slots":
            upgrade.addResourceCost(new Resource('coins', 10, upgrade.resourceSpan));
            break
        case "Increase Worker Speed":
            upgrade.addResourceCost(new Resource('coins', 10, upgrade.resourceSpan));
            break
        case "Unlock Hammer":
            upgrade.addResourceCost(new Resource('coins', 10, upgrade.resourceSpan));
            break
        case "Unlock Axe":
            upgrade.addResourceCost(new Resource('coins', 10, upgrade.resourceSpan));
            break
        case "Unlock Potion":
            upgrade.addResourceCost(new Resource('coins', 30, upgrade.resourceSpan));
            break
        case "Unlock Spear":
            upgrade.addResourceCost(new Resource('coins', 30, upgrade.resourceSpan));
            break
        case "Unlock Pickaxe":
            upgrade.addResourceCost(new Resource('coins', 30, upgrade.resourceSpan));
            break
        case "Unlock Chisel":
            upgrade.addResourceCost(new Resource('coins', 50, upgrade.resourceSpan));
            break
        case "Unlock Dice":
            upgrade.addResourceCost(new Resource('coins', 30, upgrade.resourceSpan));
            break
        case "Unlock Scales":
            upgrade.addResourceCost(new Resource('coins', 30, upgrade.resourceSpan));
            break
        case "Unlock Scroll":
            upgrade.addResourceCost(new Resource('coins', 30, upgrade.resourceSpan));
            break
        case "Unlock Quill":
            upgrade.addResourceCost(new Resource('coins', 30, upgrade.resourceSpan));
            break
        case "Unlock Bow":
            upgrade.addResourceCost(new Resource('coins', 30, upgrade.resourceSpan));
            break
        case "Unlock Holy Symbol":
            upgrade.addResourceCost(new Resource('coins', 30, upgrade.resourceSpan));
            break
        case "Unlock Copper Gear":
            upgrade.addResourceCost(new Resource('wood', 100, upgrade.resourceSpan));
            break
        case "Unlock Silver Gear":
            upgrade.addResourceCost(new Resource('copper', 100, upgrade.resourceSpan));
            break
        case "Unlock Golden Gear":
            upgrade.addResourceCost(new Resource('silver', 100, upgrade.resourceSpan));
            break
        case "Unlock Magic Gems":
            upgrade.addResourceCost(new Resource('coins', 20, upgrade.resourceSpan));
            break
        default:
            console.log(`no upgrade cost for ${upgrade.name}`);
            break
    }
} */
function updateGameTime() {
    //game-time
    game.minutes += 15;
    if (game.minutes >= 60) {
        game.minutes = 0;
        game.hours++;
    }
    if (game.hours >= 24) {
        game.hours = 0;
        game.days++;
    }
    displayText();
}
function areArraysEqual(array1, array2) {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}
function moveGear(item, source, sourceArray, sourceDiv, destination, destinationArray, destinationDiv) {
    let sourceWorker;
    let sourceString;
    let destinationWorker;
    let destinationString;
    let swap = false;
    if (source == destination) {
        console.log("source and destination are the same");
        return;
    }
    if (source instanceof WorkerClass) {
        sourceWorker = source;
    }
    else {
        sourceString = source;
    }
    if (destination instanceof WorkerClass) {
        destinationWorker = destination;
    }
    else {
        destinationString = destination;
    }
    //check if the destination array is able to accept the item
    if (!destinationWorker && !roomAvailable(destinationArray)) {
        if (destinationArray == itemsCrafting) {
            //swap the items
            swap = true;
        }
        else {
            console.log(`no room available in ${destination} to move ${item.baseType.gearType}`);
            return;
        }
    }
    // If the source is a worker, remove the item from them
    if (sourceWorker) {
        sourceWorker.unequipItem(item);
        sourceWorker.setVocation();
    }
    //if the source is a string, remove the item from the array
    if (sourceString == "craftingItems") {
        removeItem(item, sourceArray);
    }
    else if (sourceString == "items") {
        removeItem(item, sourceArray);
    }
    //if the destination is a worker, equip the item to them
    if (destinationWorker) {
        //if the destination worker already has an item equipped, move it back to the source
        if (destinationArray[0]) {
            //must move the sourcediv's parent as the sourcediv is actually an item and not the gear container on the worker
            let newDiv = sourceDiv.parentElement;
            moveGear(destinationArray[0], destinationWorker, destinationArray, destinationDiv, source, sourceArray, newDiv);
        }
        destinationWorker.equipItem(item);
    }
    //if the destination is a string, add the item to the array
    if (destinationString) {
        if (swap) {
            moveGear(destinationArray[0], destination, destinationArray, destinationDiv, source, sourceArray, sourceDiv);
        }
        destinationArray.push(item);
    }
    item.setParentDiv(destinationDiv);
    emptyGearDisplay();
    displayText();
}
function removeItem(item, array) {
    const index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}
function controlWorkers() {
    let tempWorkers = workers;
    //sort tempWorkers by workSpeed
    tempWorkers.sort((a, b) => (a.energy > b.energy) ? 1 : -1);
    let working = (game.hours > hoursStart && game.hours < hoursEnd);
    if (working) {
        //loop through each worker and do work
        for (let i = 0; i < workers.length; i++) {
            workers[i].doWork();
        }
    }
    if (!working) {
        //loop through each worker and do work/eat
        //loop through each worker and do eat
        for (let i = 0; i < tempWorkers.length; i++) {
            tempWorkers[i].eat();
            //if the worker isnt rested, make them rest
            if (tempWorkers[i].rested == false) {
                tempWorkers[i].rest();
            }
        }
    }
}
function workersEat() {
    let food = getResourceByName('food');
    //while we have food left and the workers are hungry, eat
    let maxIterations = 1000;
    while (food.amount > 0 && workersAreHungry() && maxIterations > 0) {
        let hungriestWorker = findHungriestWorker();
        if (hungriestWorker) {
            hungriestWorker.eat();
        }
        maxIterations--;
    }
    if (maxIterations <= 0) {
        console.log("max iterations reached");
    }
}
function workersAreHungry() {
    let hungry = false;
    for (let i = 0; i < workers.length; i++) {
        if (workers[i].hunger > 0) {
            hungry = true;
        }
    }
    return hungry;
}
function findHungriestWorker() {
    let tempWorkers = workers;
    //sort tempWorkers by hunger
    tempWorkers.sort((a, b) => (a.hunger > b.hunger) ? 1 : -1);
    return tempWorkers[0];
}
gameLoop();
let gamespeed = 1;
//do the game loop every 100 milliseconds
setInterval(gameLoop, 100 / gamespeed);
//main game loop
function gameLoop() {
    updateGameTime();
    controlWorkers();
}
//initial display
displayResources();
displayGems();
controlCraftingButtons();
