"use strict";
//list of workers
let workers = [];
//create resources list of initial resources available
let resources = [
    new Resource('food', 0),
    new Resource('wood', 0),
    new Resource('stone', 0),
    new Resource('copper', 0),
    new Resource('silver', 0),
    new Resource('gold', 0),
    new Resource('coins', 0),
];
function setResourceActive(name) {
    //set the default resource to be active
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].name == name) {
            resources[i].active = true;
        }
    }
}
setResourceActive('food');
setResourceActive('coins');
//list of gems  
let gems = [
    new Gem("Diamond", "💎", 0, false),
    new Gem("Ruby", "💎", 0, false),
    new Gem("Emerald", "💎", 0, false),
];
function setGemActive(name) {
    //set the default resource to be active
    for (let i = 0; i < gems.length; i++) {
        if (gems[i].name == name) {
            gems[i].active = true;
        }
    }
}
setGemActive("Diamond");
setGemActive("Ruby");
setGemActive("Emerald");
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
let begList = [];
function createBegList() {
    //get the food resource from the resources
    let food = new Resource('food', 0);
    let coins = new Resource('coins', 0);
    return [
        new Beg("food", food, 1, 10),
        new Beg("coins", coins, 1, 10),
    ];
}
//todo fix begging
begList = createBegList();
//list of items
let items = [];
function roomAvailable(array) {
    //if the array is the same as items
    if (array == items) {
        if (items.length < game.gearCountMax) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (array == craftingItems) {
        if (craftingItems.length < craftingItemsMax) {
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
let craftingItems = [];
let craftingItemsMax = 1;
//list of items
let deletedItems = [];
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
let nameList = [];
loadJson('../dist/data/names-male.json').then(data => {
    nameList = data.data;
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
let baseTypeList = [];
loadJson('../dist/data/basetypes.json').then(data => {
    baseTypeList = data;
    //create a basetype for each in the list
    for (let i = 0; i < baseTypeList.length; i++) {
        let baseType = baseTypeList[i];
        let name = baseType.name;
        let gearType = baseType.gearType;
        let resourceCost = baseType.resourceCost;
        let resource = baseType.resource;
        let itemMods = baseType.itemMods;
        let implicit = baseType.implicit;
        let value = baseType.value;
        let craftingCost = baseType.craftingCost;
        //create arrays for each item in the string for resourceCost and resource
        let resourceCostArray = [];
        let resourceArray = [];
        if (resourceCost && resource) {
            //split the string into an array
            resourceCost = resourceCost.split(", ");
            resource = resource.split(", ");
            for (let j = 0; j < resourceCost.length; j++) {
                resourceCostArray.push(parseInt(resourceCost[j]));
            }
            for (let j = 0; j < resource.length; j++) {
                resourceArray.push(resource[j]);
            }
        }
        //create an itemMod for the item power
        let newBaseType = new BaseType(name, gearType, resourceCostArray, resourceArray, itemMods, implicit, value, craftingCost);
        baseTypes.push(newBaseType);
    }
    initializeCrafting();
});
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
    if (source instanceof Laborer) {
        sourceWorker = source;
    }
    else {
        sourceString = source;
    }
    if (destination instanceof Laborer) {
        destinationWorker = destination;
    }
    else {
        destinationString = destination;
    }
    //check if the destination array is able to accept the item
    if (!destinationWorker && !roomAvailable(destinationArray)) {
        if (destinationArray == craftingItems) {
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
    if (sourceString) {
        removeItem(item, sourceArray);
    }
    //if the destination is a worker, equip the item to them
    if (destinationWorker) {
        //if the destination worker already has an item equipped, move it back to the source
        if (destinationWorker.weapon[0]) {
            moveGear(destinationWorker.weapon[0], destinationWorker, destinationWorker.weapon, destinationWorker.gearDiv, source, sourceArray, sourceDiv);
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
    //set the parent of the item
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
function createWorker() {
    if (game.workerCountCurrent < game.workerCountMax) {
        //create a new worker
        let newWorker = new Laborer();
        //add the new worker to the list of workers
        workers.push(newWorker);
        game.workerCountCurrent++;
        showFakeBegButton();
    }
    displayText();
}
//create a few upgrades
let upgradeList = [
    new Upgrade("Unlock Workers", true, 10, 0, new Resource('coins', 0), 1, unlockWorkers, ["Worker"], ["Worker"]),
    new Upgrade("Unlock Gear", false, 10, 0, new Resource('coins', 0), 1, unlockGear, ["Worker"], ["Gear"]),
    new Upgrade("Hire Worker", false, 10, 0, new Resource('food', 0), 10, createWorker, ["Worker"], ["WorkHire"]),
    new Upgrade("Increase Gear Slots", false, 10, 0, new Resource('coins', 0), 10, increaseGearCountMax, ["Gear"]),
    //max worker slots
    new Upgrade("Increase Worker Slots", false, 10, 0, new Resource('coins', 0), 10, increaseWorkerMax, ["WorkHire"]),
    //increase worker speed
    new Upgrade("Increase Worker Speed", false, 10, 0, new Resource('coins', 0), 10, increaseWorkerSpeed, ["WorkHire"]),
];
function increaseWorkerMax() {
    game.workerCountMax++;
}
function increaseGearCountMax() {
    game.gearCountMax++;
}
function unlockGear() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedGear) {
        game.unlockedGear = true;
        gearContainer.style.display = "block";
        game.gearCountMax++;
        if (game.unlockedWorkers) {
            createFakeBegButton();
        }
    }
}
function unlockMaterials() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedMaterials) {
        materialsDiv.style.display = "block";
        game.unlockedMaterials = true;
    }
}
function unlockCrafting() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedCrafting) {
        craftingDiv.style.display = "block";
        game.unlockedCrafting = true;
    }
}
function unlockWorkers() {
    if (!game.unlockedWorkers) {
        workerContainer.style.display = "block";
        game.workerCountMax++;
        game.unlockedWorkers = true;
    }
}
function increaseWorkerSpeed() {
    Laborer.workSpeedDefault += 5;
    //loop through each worker and display
    for (let i = 0; i < workers.length; i++) {
        workers[i].workSpeed += 5;
        workers[i].setParagraph();
    }
}
//loop through the list of upgrades and if they are not available, make them available
function unlockUpgrades() {
    for (let i = 0; i < upgradeList.length; i++) {
        if (upgradeList[i].active == false) {
            //if all the tags arent in the unavailable upgrades list, make it available
            let allTagsAvailable = true;
            if (upgradeList[i].tags.length > 0) {
                for (let j = 0; j < upgradeList[i].tags.length; j++) {
                    if (Upgrade.unavailableUpgrades.includes(upgradeList[i].tags[j])) {
                        allTagsAvailable = false;
                    }
                }
            }
            if (allTagsAvailable) {
                upgradeList[i].active = true;
                upgradeList[i].displayActive();
            }
        }
    }
    showUpgrades();
}
function controlWorkers() {
    let tempWorkers = workers;
    //sort tempWorkers by workSpeed
    tempWorkers.sort((a, b) => (a.workSpeed > b.workSpeed) ? 1 : -1);
    let working = (game.hours > hoursStart && game.hours < hoursEnd);
    if (working) {
        //loop through each worker and do work
        for (let i = 0; i < workers.length; i++) {
            workers[i].doWork();
        }
    }
    if (!working) {
        //loop through each worker and do work
        for (let i = 0; i < tempWorkers.length; i++) {
            tempWorkers[i].depositResources(1);
        }
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
//do the game loop every 100 milliseconds
setInterval(gameLoop, 100);
//main game loop
function gameLoop() {
    updateGameTime();
    controlWorkers();
    displayText();
}
gameLoop();
displayResources();
controlCraftingButtons();
