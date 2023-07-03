//get html elements for assigning text
//game-time
const days = <HTMLElement>document.getElementById('game-time-days');
const hours = <HTMLElement>document.getElementById('game-time-hours');
const minutes = <HTMLElement>document.getElementById('game-time-minutes');

//game-time-speed
const time_multiplier = <HTMLElement>document.getElementById('game-time-speed-multiplier');

//workers
const workerContainer = document.getElementById('workers') as HTMLDivElement;
//worker-count-current
const workerCountCurrent = <HTMLElement>document.getElementById('worker-count-current');
//worker-count-max
const workerCountMax = <HTMLElement>document.getElementById('worker-count-max');
//worker-list
const workerList = <HTMLElement>document.getElementById('worker-list');


//crafting
const craftingDiv = <HTMLElement>document.getElementById('crafting');
//crafting-progress
const craftingProgress = <HTMLElement>document.getElementById('crafting-progress');

//buttons
//create-gear
const createGearButton = <HTMLButtonElement>document.getElementById('create-gear');

//gear
const gearContainer = document.getElementById('gear') as HTMLDivElement;
//gear-count-current
const gearCountCurrent = <HTMLElement>document.getElementById('gear-count-current');
//gear-count-max
const gearCountMax = <HTMLElement>document.getElementById('gear-count-max');

//hide the gear and worker containers
gearContainer.style.display = "none"
workerContainer.style.display = "none"
craftingDiv.style.display = "none"

let hoursStart = 0;
let hoursEnd = 24;




//initialize game variables
let game = {
    //game-time
    days: 0,
    hours: 0,
    minutes: 0,
    //game-time-speed
    time_multiplier: 1,
    //workers
    //worker-count-current
    workerCountCurrent: 0,
    //worker-count-max
    workerCountMax: 0,
    gearCountCurrent: 0,
    gearCountMax: 0
}

let points = 0;

let craftProgress = 0;

let upgradePoints = 0;

//list of workers
let workers: Laborer[] = [];

//create resources list of initial resources available
let resources: Resource[] = [
    new Resource(ResourceType.food, 0, "🍞"),
    new Resource(ResourceType.wood, 0, "🌲"),
    new Resource(ResourceType.stone, 0, "⛰️"),
    new Resource(ResourceType.gems, 0, "💎"),
    new Resource(ResourceType.metal, 0, "⛏️"),
    new Resource(ResourceType.coins, 0, "💰"),
];

let begList: Beg[] = [
    new Beg("food", resources[ResourceType.food], 1, 10),
    new Beg("coins", resources[ResourceType.coins], 1, 10),
];

//list of items
let items: Item[] = [];

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
loadJson('../dist/json/names-male.json').then(data => {
    nameList = data.data;
});



function updateGameTime() {
    //game-time
    game.minutes += game.time_multiplier;
    if (game.minutes >= 60) {
        game.minutes = 0;
        game.hours++;
    }
    if (game.hours >= 24) {
        game.hours = 0;
        game.days++;
    }
}






createGearButton.onclick = function () {
    createRandomGear();
}




function moveGear(item: Item, destination: Laborer | Item[], source: Laborer | Item[] | null) {
    //if a worker is already wearing this item, remove it from them

    if (source instanceof Laborer) {
        source.unequipItem(item)
        source.setVocation();
    }
    if (Array.isArray(source)) {
        //remove gear from list of items
        items = items.filter(myitem => myitem.id !== item.id);
        game.gearCountCurrent--;
    }

    if (destination instanceof Laborer) {
        if (destination.weapon) {
            if (source instanceof Laborer) {
                //move the item back to the other list
                moveGear(destination.weapon, source, destination)
            }
            else {
                destination.weapon.setParentDiv(document.getElementById('gear-list') as HTMLDivElement)
                items.push(destination.weapon);
                destination.unequipItem(destination.weapon);

                game.gearCountCurrent++;
            }

        }
        destination.equipItem(item)
    }
    if (Array.isArray(destination)) {
        item.setParentDiv(document.getElementById('gear-list') as HTMLDivElement)
        items.push(item);
        game.gearCountCurrent++;
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

function createRandomGear() {

    let randomGearType = gearTypes[Math.floor(Math.random() * gearTypes.length)];
    let randomItemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    //set it to weapon for now while we only have weapons
    randomItemType = "Weapon"
    //create a new worker
    createGear(randomItemType, randomGearType);
}


function createGear(itemType: ItemType, GearType: GearType) {
    let newGear = new Item(itemType, GearType);
    items.push(newGear);
    game.gearCountCurrent++;
    displayText();
}



//create a few upgrades
let upgradeList: Upgrade[] = [
    new Upgrade("Unlock Workers", true, 10, 0, getEmptyResourceByName(ResourceType.coins), 1, unlockWorkers, ["Worker"], ["Worker"]),
    new Upgrade("Unlock Gear", true, 10, 0, getEmptyResourceByName(ResourceType.coins), 1, unlockGear, ["Gear"], ["Gear"]),
    new Upgrade("Hire Worker", false, 10, 0, getEmptyResourceByName(ResourceType.food), 10, createWorker, ["Worker"]),
    new Upgrade("Increase Gear Slots", false, 10, 0, getEmptyResourceByName(ResourceType.coins), 10, increaseGearCountMax, ["Gear"]),
    //max worker slots
    new Upgrade("Increase Worker Slots", false, 10, 0, getEmptyResourceByName(ResourceType.coins), 10, increaseWorkerMax, ["Worker"]),
    //increase worker speed
    new Upgrade("Increase Worker Speed", false, 10, 0, getEmptyResourceByName(ResourceType.coins), 10, createWorker, ["Worker"]),
];

function increaseWorkerMax() {
    game.workerCountMax++;
}

function increaseGearCountMax() {
    game.gearCountMax++;
}

function unlockGear() {
    gearContainer.style.display = "block"
    game.gearCountMax++;
}

function unlockWorkers() {

    workerContainer.style.display = "block"
    game.workerCountMax++;
}

//loop through the list of upgrades and if they are not available, make them available
function unlockUpgrades(){
    for(let i = 0; i < upgradeList.length; i++){
        if(upgradeList[i].active == false){
            //if all the tags arent in the unavailable upgrades list, make it available
            let allTagsAvailable = true;
            if(upgradeList[i].tags.length > 0){
                for(let j = 0; j < upgradeList[i].tags.length; j++){
                    if(Upgrade.unavailableUpgrades.includes(upgradeList[i].tags[j])){
                        allTagsAvailable = false;
                    }
                }
            }

            if(allTagsAvailable){
                upgradeList[i].active = true;
                upgradeList[i].displayActive();
            }

        }
    }
    showUpgrades()

    
}




function craftItem() {
    //if the progress is 100, create the item
    if (craftProgress >= 100) {
        //create a new item
        createRandomGear();
        //reset the progress
        craftProgress = 0;
    }
}

function controlWorkers() {
    //if the hours are even, do work
    if (game.hours % 2 == 0) {

        //loop through each worker and do work
        for (let i = 0; i < workers.length; i++) {
            workers[i].doWork();
        }
    }
    //if the hours are odd, deposit resources
    if (game.hours % 2 != 0) {

        //loop through each worker and do work
        for (let i = 0; i < workers.length; i++) {
            workers[i].depositResources(1);
        }
    }
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