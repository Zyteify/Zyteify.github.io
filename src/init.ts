//get html elements for assigning text
//game-time
const days = <HTMLElement>document.getElementById('game-time-days');
const hours = <HTMLElement>document.getElementById('game-time-hours');

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
const craftingResource = <HTMLElement>document.getElementById('crafting-resource');

//buttons


//gear
const gearContainer = document.getElementById('gear') as HTMLDivElement;
//gear-count-current
const gearCountCurrent = <HTMLElement>document.getElementById('gear-count-current');
//gear-count-max
const gearCountMax = <HTMLElement>document.getElementById('gear-count-max');
//delete-div
const deleteDiv = <HTMLElement>document.getElementById('delete-div');

//hide the gear and worker containers
gearContainer.style.display = "none"
workerContainer.style.display = "none"
craftingDiv.style.display = "none"

let hoursStart = 8;
let hoursEnd = 20;




//initialize game variables
let game = {
    //game-time
    days: 1,
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
    gearCountMax: 0,
    //player state
    unlockedHoe: false,
    unlockedAxe: false,
    unlockedHammer: false,
    unlockedWorkers: false,
    unlockedGear: false,
    unlockedPickaxe: false,
    unlockedCrafting: false,

}

let points = 0;

let craftResource = 0;

let upgradePoints = 0;