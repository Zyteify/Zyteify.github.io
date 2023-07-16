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
const materialsGemList = document.getElementById('materials-list');
//resources
const resourceList = document.getElementById('resource-list');
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
const craftingItemSectionDiv = document.getElementById('crafting-item-section');
const craftingItemNameDiv = document.getElementById('crafting-item-name');
const craftingItemPictureDiv = document.getElementById('crafting-item-picture');
const craftingItemGearDiv = document.getElementById('crafting-item-gear');
const craftingItemStatsDiv = document.getElementById('crafting-item-stats');
const craftingOptionsDiv = document.getElementById('crafting-options');
const craftingMaterialsListDiv = document.getElementById('crafting-materials-list');
//upgrades
const upgradeButtonList = document.getElementById('upgrade-list');
let buttonUpgrades = document.getElementById(`button-upgrade`);
let upgradeDiv = document.getElementById(`upgrades`);
let buttonCrafting = document.getElementById(`button-crafting`);
let craftingDiv = document.getElementById(`crafting`);
let buttonQuests = document.getElementById(`button-quests`);
let questDiv = document.getElementById(`quests`);
let buttonWorld = document.getElementById(`button-world`);
let worldDiv = document.getElementById(`world`);
let emptyDiv = document.getElementById(`empty`);
let buttonImageUpgrades = document.getElementById(`button-image-upgrade`);
let buttonImageCrafting = document.getElementById(`button-image-crafting`);
let buttonImageQuests = document.getElementById(`button-image-quests`);
let buttonImageWorld = document.getElementById(`button-image-world`);
//for the main section, which buttons control which div
let buttons = [];
buttons = [
    {
        name: 'upgrades',
        div: upgradeDiv,
        button: buttonUpgrades,
        image: buttonImageUpgrades
    },
    {
        name: 'crafting',
        div: craftingDiv,
        button: buttonCrafting,
        image: buttonImageCrafting
    },
    {
        name: 'quests',
        div: questDiv,
        button: buttonQuests,
        image: buttonImageQuests
    },
    {
        name: 'world',
        div: worldDiv,
        button: buttonWorld,
        image: buttonImageWorld
    }
];
//hide the gear and worker containers
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
    unlockedSpade: false,
    unlockedAxe: false,
    unlockedHammer: false,
    unlockedWorkers: false,
    unlockedGear: false,
    unlockedPickaxe: false,
    unlockedCraftingButton: false,
    unlockedCrafting: false,
    unlockedMaterials: false,
    craftingItemsMax: 1
};
let craftWork = 0;
let upgradePoints = 0;
