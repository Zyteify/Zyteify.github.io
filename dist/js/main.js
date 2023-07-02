"use strict";
//get html elements for assigning text
//game-time
const days = document.getElementById('game-time-days');
const hours = document.getElementById('game-time-hours');
const minutes = document.getElementById('game-time-minutes');
//game-time-speed
const time_multiplier = document.getElementById('game-time-speed-multiplier');
//workers
//worker-count-current
const workerCountCurrent = document.getElementById('worker-count-current');
//worker-count-max
const workerCountMax = document.getElementById('worker-count-max');
//worker-list
const workerList = document.getElementById('worker-list');
//crafting
//crafting-progress
const craftingProgress = document.getElementById('crafting-progress');
//buttons
//create-worker
const createWorkerButton = document.getElementById('create-worker');
//create-gear
const createGearButton = document.getElementById('create-gear');
//gear
//gear-count-current
const gearCountCurrent = document.getElementById('gear-count-current');
//gear-count-max
const gearCountMax = document.getElementById('gear-count-max');
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
    new Resource(ResourceType.food, 0, "🍞"),
    new Resource(ResourceType.wood, 0, "🌲"),
    new Resource(ResourceType.stone, 0, "⛰️"),
    new Resource(ResourceType.gems, 0, "💎"),
    new Resource(ResourceType.metal, 0, "⛏️"),
    new Resource(ResourceType.coins, 0, "💰"),
];
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
//when buttons are clicked
createWorkerButton.onclick = function () {
    createWorker();
};
createGearButton.onclick = function () {
    createRandomGear();
};
//for development purposes
for (let i = 0; i < gearTypes.length; i++) {
    //create a button for each gear type
    let button = document.createElement('button');
    button.innerHTML = gearTypes[i];
    button.onclick = function () {
        createGear("Weapon", gearTypes[i]);
    };
    let craftingContainer = document.getElementById('crafting');
    craftingContainer.appendChild(button);
}
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
    //create a new worker
    let newWorker = new Laborer("John");
    //add the new worker to the list of workers
    workers.push(newWorker);
    game.workerCountCurrent++;
    game.workerCountMax++;
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
//create a button to display text
let displayTextButton = document.createElement('button');
displayTextButton.innerHTML = "Display Text";
displayTextButton.onclick = function () {
    displayText();
};
//set the button to be a child of the body
document.body.appendChild(displayTextButton);
function craftItem() {
    //if the progress is 100, create the item
    if (craftProgress >= 100) {
        //create a new item
        createRandomGear();
        //reset the progress
        craftProgress = 0;
    }
}
//main game loop
function gameLoop() {
    updateGameTime();
    controlWorkers();
    displayText();
}
displayText();
