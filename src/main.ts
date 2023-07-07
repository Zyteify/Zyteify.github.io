

//list of workers
let workers: Laborer[] = [];

//create resources list of initial resources available
let resources: Resource[] = [

    new Resource(ResourceType.food, 0),
    new Resource(ResourceType.wood, 0),
    new Resource(ResourceType.stone, 0),
    new Resource(ResourceType.gems, 0),
    new Resource(ResourceType.metal, 0),
    new Resource(ResourceType.coins, 0),

];

function setResourceActive(name: ResourceType) {
    //set the default resource to be active
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].name == name) {
            resources[i].active = true;
        }
    }
}

setResourceActive(ResourceType.food);
setResourceActive(ResourceType.coins);


//list of gems  
let gems: Gem[] = [
    new Gem("Diamond", "💎", 0, false),
    new Gem("Ruby", "💎", 0, false),
    new Gem("Emerald", "💎", 0, false),
]


function setGemActive(name: string) {
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


let begList: Beg[] = [];
function createBegList() {
    //get the food resource from the resources
    let food = <Resource>getResourceByName(ResourceType.food);
    let coins = <Resource>getResourceByName(ResourceType.coins);

    return [
        new Beg("food", food, 1, 10),
        new Beg("coins", coins, 1, 10),
    ];
}
//todo fix begging
begList = createBegList();


//list of items
let items: Item[] = [];

//list of items
let craftingItems: Item[] = [];

let craftingItemsMax = 1;

//list of items
let deletedItems: Item[] = [];

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
let nameList: string[] = [];
loadJson('../dist/data/names-male.json').then(data => {
    nameList = data.data;
});

//load the json data for items
let affixList: Affix[] = [];
loadJson('../dist/data/affixes.json').then(data => {
    affixList = data as Affix[];
});


//todo verify the affixList is indeed an array of affixes at runtime
//this is not checked and may introduce bugs


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







function areArraysEqual(array1: any[], array2: any[]): boolean {
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}



function moveGear(item: Item, destination: Laborer | Item[], source: Laborer | Item[] | null, destinationDiv?: HTMLDivElement) {
    //if a worker is already wearing this item, remove it from them
    let sourceItemArray: Item[] = [];
    let destinationItemArray: Item[] = [];
    let itemsOriginal = items;

    if (source && Array.isArray(source)) {
        sourceItemArray = <Item[]>source
        if (areArraysEqual(sourceItemArray, itemsOriginal)) {
            //remove gear from list of items
            items = items.filter(myitem => myitem.id !== item.id);
            game.gearCountCurrent--;
        }
        else if (areArraysEqual(sourceItemArray, craftingItems)) {
            //remove gear from list of craftingItems
            craftingItems = craftingItems.filter(myitem => myitem.id !== item.id);
        }
        else {
            console.log("source is not items or craftingItems")
        }

    }
    //if the source is from a worker, remove it from them
    if (source instanceof Laborer) {
        source.unequipItem(item)
        source.setVocation();
    }




    if (destination instanceof Laborer) {
        if (destination.weapon) {
            if (source instanceof Laborer) {
                //move the item back to the other list
                moveGear(destination.weapon, source, destination)
            }
            else {
                destination.weapon.setParentDiv(gearListContainer)
                items.push(destination.weapon);
                destination.unequipItem(destination.weapon);

                game.gearCountCurrent++;
            }

        }
        destination.equipItem(item)
    }


    //checking for when the destination is an empty array, we are not able to tell which array it is
    if(destinationDiv == gearListContainer){
        item.setParentDiv(gearListContainer)
        items.push(item);
        game.gearCountCurrent++;
    }
    else if(destinationDiv == craftingItemSectionDiv){
        item.setParentDiv(craftingItemSectionDiv)
        craftingItems.push(item);
    }

    else if (destination && Array.isArray(destination)) {
        
        destinationItemArray = <Item[]>destination
        if (areArraysEqual(destinationItemArray, itemsOriginal)) {
            item.setParentDiv(gearListContainer)
            items.push(item);
            game.gearCountCurrent++;
        }
        else if (areArraysEqual(destinationItemArray, craftingItems)) {
            item.setParentDiv(craftingItemSectionDiv)
            craftingItems.push(item);
        }
        else {
            console.log("destination is not items or craftingItems")
        }

    }


    emptyGearDisplay();
    displayText();
}

function createWorker() {
    if (game.workerCountCurrent < game.workerCountMax) {

        //create a new worker
        let newWorker = new Laborer();
        //add the new worker to the list of workers
        workers.push(newWorker);
        game.workerCountCurrent++;
    }

    displayText();
}





//create a few upgrades
let upgradeList: Upgrade[] = [
    new Upgrade("Unlock Workers", true, 10, 0, new Resource(ResourceType.coins, 0), 1, unlockWorkers, ["Worker"], ["Worker"]),
    new Upgrade("Unlock Gear", false, 10, 0, new Resource(ResourceType.coins, 0), 1, unlockGear, ["Worker"], ["Gear"]),
    new Upgrade("Hire Worker", false, 10, 0, new Resource(ResourceType.food, 0), 10, createWorker, ["Worker"], ["WorkHire"]),
    new Upgrade("Increase Gear Slots", false, 10, 0, new Resource(ResourceType.coins, 0), 10, increaseGearCountMax, ["Gear"]),
    //max worker slots
    new Upgrade("Increase Worker Slots", false, 10, 0, new Resource(ResourceType.coins, 0), 10, increaseWorkerMax, ["WorkHire"]),
    //increase worker speed
    new Upgrade("Increase Worker Speed", false, 10, 0, new Resource(ResourceType.coins, 0), 10, increaseWorkerSpeed, ["WorkHire"]),
];

function increaseWorkerMax() {


    game.workerCountMax++;
}

function increaseGearCountMax() {
    game.gearCountMax++;
    showFakeBegButton()

}


function unlockGear() {

    //if this upgrade is to unlock a div, show it
    if (!game.unlockedGear) {
        game.unlockedGear = true;

        gearContainer.style.display = "block"
        game.gearCountMax++;
        if (game.unlockedWorkers) {
            createFakeBegButton();
        }

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
        craftingDiv.style.display = "block"
        game.unlockedCrafting = true;
    }
}

function unlockWorkers() {
    if (!game.unlockedWorkers) {
        workerContainer.style.display = "block"
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
    showUpgrades()
}





function controlWorkers() {
    let tempWorkers = workers;
    //sort tempWorkers by workSpeed
    tempWorkers.sort((a, b) => (a.workSpeed > b.workSpeed) ? 1 : -1)
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
    let food = <Resource>getResourceByName(ResourceType.food);
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

//do the game loop every 100 milliseconds
setInterval(gameLoop, 100);

//main game loop
function gameLoop() {
    updateGameTime();
    controlWorkers();
    displayText();
}

gameLoop();
displayResources()
controlCraftingButtons()