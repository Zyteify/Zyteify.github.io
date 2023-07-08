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
//Materials
const materialsDiv = document.getElementById('materials');
//Materials-create-gear
const materialsCreateGearButton = document.getElementById('materials-create-gear');
//Materials-item-dropdown
const materialsItemDropdown = document.getElementById('material-basetypename-dropdown');
//Materials-gear-dropdown
const materialsGearDropdown = document.getElementById('material-geartype-dropdown');
//Materials-progress
const materialsResource = document.getElementById('materials-resource');
//gear
const gearContainer = document.getElementById('gear');
//gear
const gearListContainer = document.getElementById('gear-list');
//gear-count-current
const gearCountCurrent = document.getElementById('gear-count-current');
//gear-count-max
const gearCountMax = document.getElementById('gear-count-max');
//delete-div
const deleteDiv = document.getElementById('delete-div');
//crafting
const craftingDiv = document.getElementById('crafting');
const craftingItemSectionDiv = document.getElementById('crafting-item-section');
const craftingItemNameDiv = document.getElementById('crafting-item-name');
const craftingItemPictureDiv = document.getElementById('crafting-item-picture');
const craftingItemGearDiv = document.getElementById('crafting-item-gear');
const craftingItemStatsDiv = document.getElementById('crafting-item-stats');
const craftingOptionsDiv = document.getElementById('crafting-options');
const craftingMaterialsListDiv = document.getElementById('crafting-materials-list');
//hide the gear and worker containers
gearContainer.style.display = "none";
workerContainer.style.display = "none";
materialsDiv.style.display = "none";
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
    unlockedCraftingButton: false,
    unlockedCrafting: false,
    unlockedMaterials: false,
};
let craftWork = 0;
let upgradePoints = 0;
