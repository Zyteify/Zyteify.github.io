

//list of workers
let workers: WorkerClass[] = [];

//create resources list of initial resources available
let resources: Resource[] = [
    new Resource('food', 0, resourceList),
    new Resource('wood', 0, resourceList),
    new Resource('stone', 0, resourceList),
    new Resource('copper', 0, resourceList),
    new Resource('silver', 0, resourceList),
    new Resource('gold', 0, resourceList),
    new Resource('coins', 0, resourceList),

];

function setResourceActive(name: ResourceType) {
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
loadJson('../dist/data/basetypes.json').then(data => {
    let baseTypeListTemp = data as any[];

    //create a basetype for each in the list
    for (let i = 0; i < baseTypeListTemp.length; i++) {
        let baseType = baseTypeListTemp[i];
        let name = baseType.name;
        let gearType = baseType.gearType;
        let gearSlot = baseType.gearSlot;
        let resources = baseType.resources;
        let itemMods = baseType.itemMods;
        let craftingCost = baseType.craftingCost;

        let resourcesTemp: Resource[] = [];

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
        if (destinationArray[0]) {
            //must move the sourcediv's parent as the sourcediv is actually an item and not the gear container on the worker
            let newDiv = sourceDiv.parentElement as HTMLDivElement
            moveGear(destinationArray[0], destinationWorker, destinationArray, destinationDiv, source, sourceArray, newDiv)
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
    worldDiv.classList.remove('initial-hide');
    buttonWorld.classList.remove('initial-hide');
    displayText();
}

//create a few upgrades
let upgrades: Upgrade[] = [
    new Upgrade("Unlock Workers", true, 0, 1, unlockWorkers, ["Worker"], ["Worker"]),
    new Upgrade("Hire Worker", false, 0, 10, createWorker, ["Worker"], ["WorkHire"]),
    new Upgrade("Increase Worker Slots", false, 0, 10, increaseWorkerMax, ["WorkHire"]),
    new Upgrade("Increase Worker Speed", false, 0, 10, increaseWorkerSpeed, ["WorkHire"]),
    new Upgrade("Unlock Gear", false, 0, 1, unlockGear, ["Worker"], ["Gear"]),
    new Upgrade("Unlock Hammer", false, 0, 1, unlockHammer, ["Gear"], ["Hammer"]),
    new Upgrade("Unlock Axe", false, 0, 1, unlockAxe, ["Hammer"], ["Axe"]),
    new Upgrade("Unlock Magic Gems", false, 0, 1, unlockGems, ["Axe"], ["Gems"]),
    new Upgrade("Unlock Potion", false, 0, 1, unlockPotion, ["Axe"], ["Potion"]),
    new Upgrade("Unlock Spear", false, 0, 1, unlockSpear, ["Axe"], ["Spear"]),
    new Upgrade("Unlock Pickaxe", false, 0, 1, unlockPickaxe, ["Axe"], ["Pickaxe"]),
    new Upgrade("Unlock Chisel", false, 0, 1, unlockChisel, ["Pickaxe"], ["Chisel"]),
    new Upgrade("Unlock Dice", false, 0, 1, unlockDice, ["Axe"], ["Dice"]),
    new Upgrade("Unlock Scales", false, 0, 1, unlockScales, ["Axe"], ["Scales"]),
    new Upgrade("Unlock Scroll", false, 0, 1, unlockScroll, ["Axe"], ["Scroll"]),
    new Upgrade("Unlock Bow", false, 0, 1, unlockBow, ["Axe"], ["Bow"]),
    new Upgrade("Unlock Quill", false, 0, 1, unlockQuill, ["Axe"], ["Quill"]),
    new Upgrade("Unlock Holy Symbol", false, 0, 1, unlockHolySymbol, ["Axe"], ["Holy Symbol"]),
    new Upgrade("Unlock Copper Gear", false, 0, 1, unlockCopper, ["Pickaxe"], ["Copper"]),
    new Upgrade("Unlock Silver Gear", false, 0, 1, unlockSilver, ["Copper"], ["Silver"]),
    new Upgrade("Unlock Golden Gear", false, 0, 1, unlockGolden, ["Silver"], ["Golden"]),
];

//add the costs to the upgrades
for (let i = 0; i < upgrades.length; i++) {
    let upgrade = <Upgrade>getUpgradeByName(upgrades[i].name)
    switch (upgrade.name) {
        case "Unlock Workers":
            upgrade.addResourceCost(new Resource('coins', 0, upgrade.resourceSpan));
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
}

function increaseWorkerMax() {
    game.workerCountMax++;
    flashElementGood(workerCount)
}

function unlockHammer() {
    if (!game.unlockedGearType.Hammer) {
        let gearSlot: GearSlot = "Weapon";
        let gearType: GearType = "Hammer";
        let baseMaterial: BaseMaterial = "Scrap";
        let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType)
        if (baseType) {
            let gearCreation = createGear(baseType, 'Starter');
            if (gearCreation) {
                game.unlockedGearType.Hammer = true;
                unlockCraftingButtonTypeActiveAllWeapons()
                unlockCraftingButtonTypeSelectable("Hammer", "gearType")
                unlockCraftingButtonTypeSelectable("Wooden", "baseTypeName")
                unlockCrafting()
                unlockMaterials()
            }
            else {
                console.log("error creating hammer")
                //reset the upgrade
                let upgrade = <Upgrade>getUpgradeByName("Unlock Hammer")
                upgrade.active = true;
                upgrade.level--;
                upgrade.display();
            }
        }
    }
}

function unlockAxe() {
    if (!game.unlockedGearType.Axe) {
        let gearSlot: GearSlot = "Weapon";
        let gearType: GearType = "Axe";
        let baseMaterial: BaseMaterial = "Scrap";
        let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType)
        if (baseType) {
            let gearCreation = createGear(baseType, 'Starter');
            if (gearCreation) {
                game.unlockedGearType.Axe = true;
                unlockCraftingButtonTypeActive("Wooden", "baseTypeName")
                unlockCraftingButtonTypeSelectable("Axe", "gearType")
                //get the wood resource and make it active
                let wood = <Resource>getResourceByName('wood');
                wood.active = true;
                displayResources()
                flashElementGood(buttonCrafting)
            }
            else {
                console.log("error creating axe")
                //reset the upgrade
                let upgrade = <Upgrade>getUpgradeByName("Unlock Axe")
                upgrade.active = true;
                upgrade.level--;
                upgrade.display();
            }
        }
    }
}

function unlockSpade() {
    if (!game.unlockedGearType.Spade) {
        let gearSlot: GearSlot = "Weapon";
        let gearType: GearType = "Spade";
        let baseMaterial: BaseMaterial = "Scrap";
        let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType)
        if (baseType) {
            let gearCreation = createGear(baseType, 'Starter');
            if (gearCreation) {
                game.unlockedGearType.Spade = true;
                unlockCraftingButtonTypeSelectable("Spade", "gearType")

            }
            else {
                console.log("error creating spade")

            }
        }
    }
}

function unlockPotion() {
    if (!game.unlockedGearType.Potion) {
        game.unlockedGearType.Potion = true;
        unlockCraftingButtonTypeSelectable("Potion", "gearType")
        flashElementGood(buttonCrafting)
    }
}

function unlockSpear() {
    if (!game.unlockedGearType.Spear) {
        game.unlockedGearType.Spear = true;
        unlockCraftingButtonTypeSelectable("Spear", "gearType")
        flashElementGood(buttonCrafting)
    }
}

function unlockPickaxe() {
    if (!game.unlockedGearType.Pickaxe) {
        game.unlockedGearType.Pickaxe = true;
        unlockCraftingButtonTypeSelectable("Pickaxe", "gearType")
        flashElementGood(buttonCrafting)
        let stone = <Resource>getResourceByName('stone');
        stone.active = true;
        let copper = <Resource>getResourceByName('copper');
        copper.active = true;
        let silver = <Resource>getResourceByName('silver');
        silver.active = true;
        let gold = <Resource>getResourceByName('gold');
        gold.active = true;
        displayResources()
    }
}

function unlockChisel() {
    if (!game.unlockedGearType.Chisel) {
        game.unlockedGearType.Chisel = true;
        unlockCraftingButtonTypeSelectable("Chisel", "gearType")
        flashElementGood(buttonCrafting)
        unlockMaterials()
    }
}

function unlockDice() {
    if (!game.unlockedGearType.Dice) {
        game.unlockedGearType.Dice = true;
        unlockCraftingButtonTypeSelectable("Dice", "gearType")
        flashElementGood(buttonCrafting)
    }
}

function unlockScales() {
    if (!game.unlockedGearType.Scales) {
        game.unlockedGearType.Scales = true;
        unlockCraftingButtonTypeSelectable("Scales", "gearType")
        flashElementGood(buttonCrafting)
    }
}

function unlockScroll() {
    if (!game.unlockedGearType.Scroll) {
        game.unlockedGearType.Scroll = true;
        unlockCraftingButtonTypeActive("Scroll", "gearType")
        unlockCraftingButtonTypeSelectable("Scroll", "gearType")
        flashElementGood(buttonCrafting)
    }
}

function unlockBow() {
    if (!game.unlockedGearType.Bow) {
        game.unlockedGearType.Bow = true;
        unlockCraftingButtonTypeActive("Bow", "gearType")
        unlockCraftingButtonTypeSelectable("Bow", "gearType")
        flashElementGood(buttonCrafting)
    }
}

function unlockQuill() {
    if (!game.unlockedGearType.Quill) {
        game.unlockedGearType.Quill = true;
        unlockCraftingButtonTypeActive("Quill", "gearType")
        unlockCraftingButtonTypeSelectable("Quill", "gearType")
        flashElementGood(buttonCrafting)
    }
}

function unlockHolySymbol() {
    if (!game.unlockedGearType.HolySymbol) {
        game.unlockedGearType.HolySymbol = true;
        unlockCraftingButtonTypeSelectable("Holy Symbol", "gearType")
        flashElementGood(buttonCrafting)
    }
}

function unlockGear() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedGear) {
        game.unlockedGear = true;

        gearContainer.classList.remove('initial-hide');
        unlockSpade()
    }
}

function unlockMaterials() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedMaterials) {
        materialsDiv.classList.remove('initial-hide');
        game.unlockedMaterials = true;
        flashElementGood(materialsDiv)
        displayCraftWork()
    }
}

function unlockGems() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedGems) {
        materialsDiv.classList.remove('initial-hide');
        game.unlockedMaterials = true;
        flashElementGood(materialsDiv)

        //add 10 basic gems
        
    }
}

function unlockCrafting() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedCrafting) {
        craftingDiv.classList.remove('initial-hide');
        buttonCrafting.classList.remove('initial-hide');
        game.unlockedCrafting = true;
        flashElementGood(buttonCrafting)
        unlockCraftingButtonTypeActive("Wooden", "baseTypeName")
    }
}

function unlockWorkers() {
    if (!game.unlockedWorkers) {
        workerContainer.classList.remove('initial-hide');

        game.workerCountMax++;
        game.unlockedWorkers = true;
    }
}

function unlockCopper() {
    if (!game.unlockedBaseMaterial.Copper) {
        game.unlockedBaseMaterial.Copper = true;
        unlockCraftingButtonTypeSelectable("Copper", "baseTypeName")
        unlockCraftingButtonTypeActive("Copper", "baseTypeName")
        flashElementGood(buttonCrafting)
    }
}

function unlockSilver() {
    if (!game.unlockedBaseMaterial.Silver) {
        game.unlockedBaseMaterial.Silver = true;
        unlockCraftingButtonTypeSelectable("Silver", "baseTypeName")
        unlockCraftingButtonTypeActive("Silver", "baseTypeName")
        flashElementGood(buttonCrafting)
    }
}

function unlockGolden() {
    if (!game.unlockedBaseMaterial.Gold) {
        game.unlockedBaseMaterial.Gold = true;
        unlockCraftingButtonTypeSelectable("Golden", "baseTypeName")
        unlockCraftingButtonTypeActive("Golden", "baseTypeName")
        flashElementGood(buttonCrafting)
    }
}

function increaseWorkerSpeed() {
    WorkerClass.workSpeedUpgradeable += 5;
    //loop through each worker and display
    for (let i = 0; i < workers.length; i++) {
        workers[i].energy += 5;
        workers[i].calculateMods()
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

function checkSoftLock(deletedGearType: GearType) {
    let gearSlot: GearSlot = "Weapon";
    let gearType: GearType = "Spade";
    let baseMaterial: BaseMaterial = "Scrap";
    let wood = <Resource>getResourceByName('wood');
    if (deletedGearType == 'Hammer' && !game.unlockedGearType.Axe) {
        //create a new hammer
        gearType = "Hammer";
        let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType)
        if (baseType) {
            createGear(baseType, 'Starter')
            alert(`Softlock Prevention: a new scrap hammer has been found`)
        }
    }
    else if (deletedGearType == 'Hammer' && game.unlockedGearType.Axe && craftWork < 5) {
        //create a new hammer
        gearType = "Hammer";
        let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType)
        if (baseType) {
            createGear(baseType, 'Starter')
            alert(`Softlock Prevention: a new scrap hammer has been found`)
        }
    }
    else if (deletedGearType == 'Axe') {
        if (wood.amount < 5) {
            //create a new axe
            gearType = "Axe";
            let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType)
            if (baseType) {
                createGear(baseType, 'Starter')
                alert(`Softlock Prevention: a new scrap axe has been found`)
            }
        }
        else if (craftWork < 5) {
            //create a new hammer
            gearType = "Hammer";
            let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType)
            if (baseType) {
                createGear(baseType, 'Starter')
                alert(`Softlock Prevention: a new scrap hammer has been found`)
            }

        }
    }
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
let gamespeed = 5;
//do the game loop every 100 milliseconds
setInterval(gameLoop, 100 / gamespeed);

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
