"use strict";
//get html elements for assigning text
//game-time
const days = document.getElementById('game-time-days');
const hours = document.getElementById('game-time-hours');
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
const craftingResource = document.getElementById('crafting-resource');
//buttons
//gear
const gearContainer = document.getElementById('gear');
//gear-count-current
const gearCountCurrent = document.getElementById('gear-count-current');
//gear-count-max
const gearCountMax = document.getElementById('gear-count-max');
//delete-div
const deleteDiv = document.getElementById('delete-div');
//hide the gear and worker containers
gearContainer.style.display = "none";
workerContainer.style.display = "none";
craftingDiv.style.display = "none";
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
};
let points = 0;
let craftResource = 0;
let upgradePoints = 0;