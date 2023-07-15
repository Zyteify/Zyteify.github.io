

//list of workers
let workers: WorkerClass[] = [];

//create resources list of initial resources available
let resources: Resource[] = [
    new Resource('food', resourceList, 0),
    new Resource('wood', resourceList, 0),
    new Resource('stone', resourceList, 0),
    new Resource('copper', resourceList, 0),
    new Resource('silver', resourceList, 0),
    new Resource('gold', resourceList, 0),
    new Resource('coins', resourceList, 0),

];

function setResourceActive(name: ResourceType) {
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
let gems: Gem[] = [
    new Gem("1", 'gem1.png', 0, false),
    new Gem("2", 'gem2.png', 0, false),
    new Gem("3", 'gem3.png', 0, false),
]

function setGemActive(name: string) {
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
function convertHoursToTime(hours: number) {
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
let itemsInventory: Item[] = [];

function roomAvailable(array: Item[]) {
    //if the array is the same as items
    if (array == itemsInventory) {
        if (itemsInventory.length < game.gearCountMax) {
            return true
        }
        else {
            return false
        }
    } else if (array == itemsCrafting) {
        if (itemsCrafting.length < game.craftingItemsMax) {
            return true
        }
        else {
            return false
        }
    }
    else {
        console.log(`unable to check room available for array ${array}`);
        return true
    }

}

//list of items
let itemsCrafting: Item[] = [];

//list of items
let itemsDeleted: Item[] = [];

function loadJson(url: string) {
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
let nameListBoy: string[] = [];
loadJson('../dist/data/boy_names.json').then(data => {
    nameListBoy = data.names;
});

//load the json data for names
let NameListGirl: string[] = [];
loadJson('../dist/data/girl_names.json').then(data => {
    NameListGirl = data.names;
});

//load the json data for items
let affixList: Affix[] = [];
loadJson('../dist/data/affixes.json').then(data => {
    affixList = data as Affix[];
});

//todo verify the affixList is indeed an array of affixes at runtime
//this is not checked and may introduce bugs

const baseTypes: BaseType[] = [];

//load the json data for basetypes
let baseTypeList: any[] = [];
loadJson('../dist/data/basetypes.json').then(data => {
    baseTypeList = data as any[];

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
        let resourceCostArray: number[] = [];
        let resourceArray: ResourceType[] = [];
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

    initializeCrafting()

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
    displayText();
}

function areArraysEqual(array1: any[], array2: any[]): boolean {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}

function moveGear(
    item: Item,
    source: string | WorkerClass,
    sourceArray: Item[],
    sourceDiv: HTMLDivElement,
    destination: string | WorkerClass,
    destinationArray: Item[],
    destinationDiv: HTMLDivElement
) {
    let sourceWorker: WorkerClass | undefined;
    let sourceString: string | undefined;
    let destinationWorker: WorkerClass | undefined;
    let destinationString: string | undefined;
    let swap = false;

    if (source == destination) {
        console.log("source and destination are the same")
        return
    }
    if (source instanceof WorkerClass) {
        sourceWorker = source;
    } else {
        sourceString = source as string;
    }

    if (destination instanceof WorkerClass) {
        destinationWorker = destination;
    } else {
        destinationString = destination as string;
    }

    //check if the destination array is able to accept the item
    if (!destinationWorker && !roomAvailable(destinationArray)) {
        if (destinationArray == itemsCrafting) {
            //swap the items
            swap = true;
        }
        else {
            console.log(`no room available in ${destination} to move ${item.baseType.gearType}`);
            return
        }

    }

    // If the source is a worker, remove the item from them
    if (sourceWorker) {
        sourceWorker.unequipItem(item)
        sourceWorker.setVocation();
    }
    //if the source is a string, remove the item from the array
    if (sourceString == "craftingItems") {
        removeItem(item, sourceArray)
    }
    else if (sourceString == "items") {
        removeItem(item, sourceArray)
    }

    //if the destination is a worker, equip the item to them
    if (destinationWorker) {
        //if the destination worker already has an item equipped, move it back to the source
        if (destinationWorker.weapon[0]) {
            moveGear(destinationWorker.weapon[0], destinationWorker, destinationWorker.weapon, destinationWorker.gearDiv, source, sourceArray, sourceDiv)
        }
        destinationWorker.equipItem(item)
    }
    //if the destination is a string, add the item to the array
    if (destinationString) {
        if (swap) {
            moveGear(destinationArray[0], destination, destinationArray, destinationDiv, source, sourceArray, sourceDiv)
        }
        destinationArray.push(item);
    }
    //set the parent of the item
    item.setParentDiv(destinationDiv)

    emptyGearDisplay();
    displayText();
}

function removeItem(item: any, array: any[]): void {
    const index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

function createWorker() {
    if (game.workerCountCurrent < game.workerCountMax) {

        //create a new worker
        let newWorker = new WorkerClass();
        //add the new worker to the list of workers
        workers.push(newWorker);
        game.workerCountCurrent++;
    }
    //add 10 to the cost of the next upgrade
    let upgrade = <Upgrade>getUpgradeByName("Hire Worker")
    if (upgrade.resourcesRequired[0].amount < 10) {
        upgrade.resourcesRequired[0].amount += 10;
    }

    displayText();
}

//create a few upgrades
let upgrades: Upgrade[] = [
    new Upgrade("Unlock Workers", true, 0, 1, unlockWorkers, ["Worker"], ["Worker"]),
    new Upgrade("Unlock Gear", false, 0, 1, unlockGear, ["Worker"], ["Gear"]),
    new Upgrade("Hire Worker", false, 0, 10, createWorker, ["Worker"], ["WorkHire"]),
    new Upgrade("Increase Gear Slots", false, 0, 10, increaseGearCountMax, ["Gear"]),
    //max worker slots
    new Upgrade("Increase Worker Slots", false, 0, 10, increaseWorkerMax, ["WorkHire"]),
    //increase worker speed
    new Upgrade("Increase Worker Speed", false, 0, 10, increaseWorkerSpeed, ["WorkHire"]),
];

//add the costs to the upgrades
for (let i = 0; i < upgrades.length; i++) {
    let upgrade = <Upgrade>getUpgradeByName(upgrades[i].name)
    switch (upgrade.name) {
        case "Unlock Workers":
            upgrade.addResourceCost(new Resource('coins', upgrade.resourceSpan, 0));
            break
        case "Unlock Gear":
            upgrade.addResourceCost(new Resource('coins', upgrade.resourceSpan, 10));
            break
        case "Hire Worker":
            upgrade.addResourceCost(new Resource('food', upgrade.resourceSpan, 0));
            break
        case "Increase Gear Slots":
            upgrade.addResourceCost(new Resource('coins', upgrade.resourceSpan, 10));
            break
        case "Increase Worker Slots":
            upgrade.addResourceCost(new Resource('coins', upgrade.resourceSpan, 10));
            break
        case "Increase Worker Speed":
            upgrade.addResourceCost(new Resource('coins', upgrade.resourceSpan, 10));
            break
        default:
            console.log(`no upgrade cost for ${upgrade.name}`);
            break
    }
}

function increaseWorkerMax() {
    game.workerCountMax++;
}

function increaseGearCountMax() {
    game.gearCountMax++;
    unlockStarterGear()
}

function unlockStarterGear() {
    // Call upgrade function with the name of the upgrade
    let gearCreation: boolean = false;
    let baseType: BaseType | null;
    switch (game.gearCountMax) {
        case 1:
            baseType = findBaseTypeByNameandGearType("Scrap", 'Spade')
            if (baseType) {
                gearCreation = createGear("Weapon", "Spade", baseType, 'Starter');
                if (gearCreation) {
                    game.unlockedSpade = true;
                }
                else{
                    console.log("error creating spade")
                }
                break;
            }

/*         case 3:
            baseType = findBaseTypeByNameandGearType("Scrap", 'Axe')
            if (baseType) {
                gearCreation = createGear("Weapon", "Axe", baseType, 'Starter');
                if (gearCreation) {
                    game.unlockedAxe = true;
                    setResourceActive('wood');
                }
                else{
                    console.log("error creating axe")
                }
                break;
            } */
        case 2:
            baseType = findBaseTypeByNameandGearType("Scrap", 'Hammer')
            if (baseType) {
                gearCreation = createGear("Weapon", "Hammer", baseType, 'Starter');
                if (gearCreation) {
                    game.unlockedHammer = true;
                    unlockMaterials()
                    unlockCrafting()

                    game.unlockedPickaxe = true;
                    setResourceActive('stone');
                    setResourceActive('copper');
                    setResourceActive('silver');
                    setResourceActive('gold');
                    setResourceActive('wood');
                }
                else{
                    console.log("error creating hammer")
                }
                break;
            }
        default:
            break;
    }
}

function unlockGear() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedGear) {
        game.unlockedGear = true;

        gearContainer.style.display = ""
        increaseGearCountMax()
    }
}

function unlockMaterials() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedMaterials) {
        materialsDiv.style.display = "block"
        game.unlockedMaterials = true;
    }
}

function unlockCrafting() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedCrafting) {
        craftingDiv.style.display = ""
        game.unlockedCrafting = true;
    }
}

function unlockWorkers() {
    if (!game.unlockedWorkers) {
        workerContainer.style.display = ""
        game.workerCountMax++;
        game.unlockedWorkers = true;
    }
}

function increaseWorkerSpeed() {
    WorkerClass.workSpeedUpgradeable += 5;
    //loop through each worker and display
    for (let i = 0; i < workers.length; i++) {
        workers[i].energy += 5;
        workers[i].calculateMods()
        workers[i].setParagraph();
    }
}

//loop through the list of upgrades and if they are not available, make them available
function unlockUpgrades() {
    for (let i = 0; i < upgrades.length; i++) {
        if (upgrades[i].active == false) {
            //if all the tags arent in the unavailable upgrades list, make it available
            let allTagsAvailable = true;
            if (upgrades[i].tags.length > 0) {
                for (let j = 0; j < upgrades[i].tags.length; j++) {
                    if (Upgrade.unavailableUpgrades.includes(upgrades[i].tags[j])) {
                        allTagsAvailable = false;
                    }
                }
            }

            if (allTagsAvailable) {
                upgrades[i].active = true;
                upgrades[i].displayActive();
            }

        }
    }
    displayUpgrades()
}

function controlWorkers() {
    let tempWorkers = workers;
    //sort tempWorkers by workSpeed
    tempWorkers.sort((a, b) => (a.energy > b.energy) ? 1 : -1)
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
    let food = <Resource>getResourceByName('food');
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
        console.log("max iterations reached")
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
    tempWorkers.sort((a, b) => (a.hunger > b.hunger) ? 1 : -1)
    return tempWorkers[0];
}

gameLoop();
//do the game loop every 100 milliseconds
setInterval(gameLoop, 100);

//main game loop
function gameLoop() {
    updateGameTime();
    controlWorkers();
}

//initial display
displayResources()
displayGems()
controlCraftingButtons()
displayUpgrades()
