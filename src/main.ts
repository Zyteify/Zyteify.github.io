//get html elements for assigning text
//game-time
const days = <HTMLElement>document.getElementById('game-time-days');
const hours = <HTMLElement>document.getElementById('game-time-hours');
const minutes = <HTMLElement>document.getElementById('game-time-minutes');

//game-time-speed
const time_multiplier = <HTMLElement>document.getElementById('game-time-speed-multiplier');

//workers
//worker-count-current
const workerCountCurrent = <HTMLElement>document.getElementById('worker-count-current');
//worker-count-max
const workerCountMax = <HTMLElement>document.getElementById('worker-count-max');
//worker-list
const workerList = <HTMLElement>document.getElementById('worker-list');

//buttons
//create-worker
const createWorkerButton = <HTMLButtonElement>document.getElementById('create-worker');
//create-gear
const createGearButton = <HTMLButtonElement>document.getElementById('create-gear');

//gear
//gear-count-current
const gearCountCurrent = <HTMLElement>document.getElementById('gear-count-current');
//gear-count-max
const gearCountMax = <HTMLElement>document.getElementById('gear-count-max');

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


//list of workers
let workers: Laborer[] = [];

//create resources list of initial resources available
let resources: Resource[] = [
    new Resource(ResourceType.food, 100, "🍞"),
    new Resource(ResourceType.wood, 100, "🌲")
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





//when buttons are clicked
createWorkerButton.onclick = function () {
    createWorker();
}

createGearButton.onclick = function () {
    createGear("Hoe");
}

//for development purposes
for (let i = 0; i < gearTypes.length; i++) {
    //create a button for each gear type
    let button = document.createElement('button');
    button.innerHTML = gearTypes[i];
    button.onclick = function () {
        createGear(gearTypes[i]);
    }
    let craftingContainer: HTMLElement = <HTMLElement>document.getElementById('crafting');
    craftingContainer.appendChild(button);
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
    //create a new worker
    let newWorker = new Laborer("John");
    //add the new worker to the list of workers
    workers.push(newWorker);
    game.workerCountCurrent++;
    game.workerCountMax++;
    displayText();
}


function createGear(GearType: GearType) {
    //create a new worker
    let newGear = new Item("weapon", GearType);
    //add the new worker to the list of workers
    items.push(newGear);
    game.gearCountCurrent++;
    game.gearCountMax++;
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
            workers[i].depositResources();
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
}
//set the button to be a child of the body
document.body.appendChild(displayTextButton);


//main game loop
function gameLoop() {
     updateGameTime();
     controlWorkers();
     displayText();
}

displayText();


