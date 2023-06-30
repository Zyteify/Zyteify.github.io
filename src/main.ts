

//get html elements for assigning text
//game-time
const days = <HTMLElement> document.getElementById('game-time-days');
const hours = <HTMLElement> document.getElementById('game-time-hours');
const minutes = <HTMLElement> document.getElementById('game-time-minutes');

//game-time-speed
const time_multiplier = <HTMLElement> document.getElementById('game-time-speed-multiplier');

//workers
//worker-count-current
const workerCountCurrent = <HTMLElement> document.getElementById('worker-count-current');
//worker-count-max
const workerCountMax = <HTMLElement> document.getElementById('worker-count-max');
//worker-list
const workerList = <HTMLElement> document.getElementById('worker-list');

//buttons
//create-worker
const createWorkerButton = <HTMLButtonElement> document.getElementById('create-worker');
//create-gear
const createGearButton = <HTMLButtonElement> document.getElementById('create-gear');

//gear
//gear-count-current
const gearCountCurrent = <HTMLElement> document.getElementById('gear-count-current');
//gear-count-max
const gearCountMax = <HTMLElement> document.getElementById('gear-count-max');

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
let workers:Laborer [] = [];

//create resources list of initial resources available
let resources:Resource[] = [
    new Resource(ResourceType.food, 100, "🍞"),
    new Resource(ResourceType.wood, 100, "🌲")
];

//list of items
let items:Item[] = [];

function displayText(){
    //game-time
    days.innerHTML = game.days.toString();
    hours.innerHTML = game.hours.toString();
    minutes.innerHTML = game.minutes.toString();
    //game-time-speed
    time_multiplier.innerHTML = game.time_multiplier.toString();
    //workers
    //worker-count-current
    workerCountCurrent.innerHTML = game.workerCountCurrent.toString();
    //worker-count-max
    workerCountMax.innerHTML = game.workerCountMax.toString();
    //gear
    //gear-count-current
    gearCountCurrent.innerHTML = game.gearCountCurrent.toString();
    //gear-count-max
    gearCountMax.innerHTML = game.gearCountMax.toString();


    displayWorkers()
    displayResources()
    displayGear()
}

//create a list text to display the workers
function displayWorkers(){

    //loop through each worker and create a paragraph element for them if it doesn't exist
    for(let i = 0; i < workers.length; i++){
        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("worker" + workers[i].id.toString())
        if(paragraph == null){

            paragraph = document.createElement('p');
            paragraph.id = "worker" + workers[i].id.toString();

            const container = document.getElementById('worker-list') as HTMLDivElement; 
            container.appendChild(paragraph);
        }
        paragraph.innerHTML = workers[i].id + " " + workers[i].name + ": " + workers[i].vocation.name;

        //display the worker's gear
        if(workers[i].weapon != null){
            paragraph.innerHTML += " " + workers[i].weapon?.gear;
        }
        if(workers[i].boot != null){
            paragraph.innerHTML += " " + workers[i].boot?.gear;
        }

        //loop through each resource in the worker's inventory
        for (let j = 0; j < workers[i].resources.length; j++) {
            //add the resource to the paragraph
            paragraph.innerHTML += " " + workers[i].resources[j].icon + " " + workers[i].resources[j].amount;
        }
    }
}

function displayGear() {
    const container = document.getElementById('gear-list') as HTMLDivElement; 
    //destory all gear elements
    container.innerHTML = "";
    //loop through each resource and create a paragraph element for them if it doesn't exist
    for(let i = 0; i < items.length; i++){
        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("gear" + items[i].id.toString())
        if(paragraph == null){

            paragraph = document.createElement('p');
            paragraph.id = "gear" + items[i].id.toString();

            
            container.appendChild(paragraph);
        }
        paragraph.innerHTML = items[i].id+" " +  items[i].type + " " + items[i].gear 
        //paragraph.innerHTML = items[i].id+ items[i].icon +items[i].prefixName + " " + items[i].baseName + " " + items[i].type + " "  + items[i].suffixName
    }
}





function displayResources() {

    //loop through each resource and create a paragraph element for them if it doesn't exist
    for(let i = 0; i < resources.length; i++){
        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("resource" + resources[i].name)
        if(paragraph == null){

            paragraph = document.createElement('p');
            paragraph.id = "resource" + resources[i].name;

            const container = document.getElementById('resource-list') as HTMLDivElement; 
            container.appendChild(paragraph);
        }
        let resourceName = ResourceType[resources[i].name]
        paragraph.innerHTML = resources[i].name +resources[i].icon + " " + resourceName+ ": " + resources[i].amount;
    }
    
}

function updateGameTime(){
    //game-time
    game.minutes += game.time_multiplier ;
    if(game.minutes >= 60){
        game.minutes = 0;
        game.hours++;
    }
    if(game.hours >= 24){
        game.hours = 0;
        game.days++;
    }
}

function gameLoop(){
    updateGameTime();
    displayText();
    //if the hours are even, do work
    if(game.hours % 2 == 0){

        //loop through each worker and do work
        for(let i = 0; i < workers.length; i++){
            workers[i].doWork();
        }
    }
    //if the hours are odd, deposit resources
    if(game.hours % 2 != 0){

        //loop through each worker and do work
        for(let i = 0; i < workers.length; i++){
            workers[i].depositResources();
        }
    }

    
}

setInterval(gameLoop, 100);

//when buttons are clicked
createWorkerButton.onclick = function(){
    createWorker();
}

createGearButton.onclick = function(){
    createGear();
}

function addGearToWorker(gearId: number, workerId: number){
    workers[workerId].equipItem(items[gearId])
    workers[workerId].setVocation();
    //remove gear from list of items
    items.splice(gearId, 1);
}

function createWorker(){
    //create a new worker
    let newWorker = new Laborer("John");
    //add the new worker to the list of workers
    workers.push(newWorker);
    game.workerCountCurrent++;
    game.workerCountMax++;
}


function createGear(){
    //create a new worker
    let newGear = new Item("weapon", "hoe");
    //add the new worker to the list of workers
    items.push(newGear);
    game.gearCountCurrent++;
    game.gearCountMax++;
}

let testButton: HTMLButtonElement = document.getElementById('test') as HTMLButtonElement;
testButton.onclick = function(){
    addGearToWorker(0, 0);
    
}