"use strict";
//get html elements for assigning text
//game-time
const days = document.getElementById('game-time-days');
const hours = document.getElementById('game-time-hours');
const minutes = document.getElementById('game-time-minutes');
//game-time-speed
const time_multiplier = document.getElementById('game-time-speed-multiplier');
//workers
const workerContainer = document.getElementById('workers');
//worker-count-current
const workerCountCurrent = document.getElementById('worker-count-current');
//worker-count-max
const workerCountMax = document.getElementById('worker-count-max');
//worker-list
const workerList = document.getElementById('worker-list');
//crafting
const craftingDiv = document.getElementById('crafting');
//crafting-progress
const craftingProgress = document.getElementById('crafting-progress');
//buttons
//create-gear
const createGearButton = document.getElementById('create-gear');
//gear
const gearContainer = document.getElementById('gear');
//gear-count-current
const gearCountCurrent = document.getElementById('gear-count-current');
//gear-count-max
const gearCountMax = document.getElementById('gear-count-max');
//hide the gear and worker containers
gearContainer.style.display = "none";
workerContainer.style.display = "none";
craftingDiv.style.display = "none";
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
};
let points = 0;
let craftProgress = 0;
let upgradePoints = 0;
//list of workers
let workers = [];
//create resources list of initial resources available
let resources = [
    new Resource(ResourceType.food, 0),
    new Resource(ResourceType.gormetFood, 0),
    /*     new Resource(ResourceType.wood, 0, "🌲"),
        new Resource(ResourceType.stone, 0, "⛰️"),
        new Resource(ResourceType.gems, 0, "💎"),
        new Resource(ResourceType.metal, 0, "⛏️"), */
    new Resource(ResourceType.coins, 0),
];
let begList = [];
function createBegList() {
    //get the food resource from the resources
    let food = getResourceByName(ResourceType.food);
    let coins = getResourceByName(ResourceType.coins);
    return [
        new Beg("food", food, 1, 10),
        new Beg("coins", coins, 1, 10),
    ];
}
//todo fix begging
begList = createBegList();
//list of items
let items = [];
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
};
function moveGear(item, destination, source) {
    //if a worker is already wearing this item, remove it from them
    if (source instanceof Laborer) {
        source.unequipItem(item);
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
                moveGear(destination.weapon, source, destination);
            }
            else {
                destination.weapon.setParentDiv(document.getElementById('gear-list'));
                items.push(destination.weapon);
                destination.unequipItem(destination.weapon);
                game.gearCountCurrent++;
            }
        }
        destination.equipItem(item);
    }
    if (Array.isArray(destination)) {
        item.setParentDiv(document.getElementById('gear-list'));
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
    randomItemType = "Weapon";
    //create a new worker
    createGear(randomItemType, randomGearType);
}
function createGear(itemType, GearType) {
    let newGear = new Item(itemType, GearType);
    items.push(newGear);
    game.gearCountCurrent++;
    displayText();
}
//create a few upgrades
let upgradeList = [
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
}
function unlockGear() {
    gearContainer.style.display = "block";
    game.gearCountMax++;
}
function unlockWorkers() {
    workerContainer.style.display = "block";
    game.workerCountMax++;
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
    let tempWorkers = workers;
    //sort tempWorkers by workSpeed
    tempWorkers.sort((a, b) => (a.workSpeed > b.workSpeed) ? 1 : -1);
    //if the hours are even, do work
    if (game.hours % 2 == 0) {
        //loop through each worker and do work
        for (let i = 0; i < workers.length; i++) {
            workers[i].doWork();
        }
    }
    //if the hours are odd, deposit resources and eat food
    if (game.hours % 2 != 0) {
        //loop through each worker and do work
        for (let i = 0; i < tempWorkers.length; i++) {
            tempWorkers[i].depositResources(1);
        }
        //loop through each worker and do eat
        for (let i = 0; i < tempWorkers.length; i++) {
            tempWorkers[i].eat();
        }
    }
}
function workersEat() {
    let food = getResourceByName(ResourceType.food);
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
