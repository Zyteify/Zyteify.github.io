"use strict";
//get html elements for assigning text
//game-time
const days = document.getElementById('game-time-days');
const hours = document.getElementById('game-time-hours');
//workers
const workerContainer = document.getElementById('workers');
//worker-count-current
const workerCount = document.getElementById('worker-count');
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
const materialsGearSlotDropdown = document.getElementById('material-gearslot-dropdown');
//Materials-item-dropdown
const materialsItemDropdown = document.getElementById('material-basetypename-dropdown');
//Materials-gear-dropdown
const materialsGearDropdown = document.getElementById('material-geartype-dropdown');
//Materials-progress
const materialsCraftWork = document.getElementById('materials-craft-work');
const materialsList = document.getElementById('materials-list');
const materialsGemList = document.getElementById('materials-gem-list');
//resources
const resourceList = document.getElementById('resource-list');
//gear
const gearContainer = document.getElementById('gear');
//gear
const gearListContainer = document.getElementById('gear-list');
/* //gear-count-current
const gearCountCurrent = <HTMLElement>document.getElementById('gear-count-current');
//gear-count-max
const gearCountMax = <HTMLElement>document.getElementById('gear-count-max'); */
//delete-div
const deleteDiv = document.getElementById('delete-div');
//crafting
//choose
const craftingChooseDiv = document.getElementById('crafting-choose-button');
const craftingItemSectionDiv = document.getElementById('crafting-item-section');
const craftingItemNameDiv = document.getElementById('crafting-item-name');
const craftingItemPictureDiv = document.getElementById('crafting-item-picture');
const craftingItemGearDiv = document.getElementById('crafting-item-gear');
const craftingItemStatsDiv = document.getElementById('crafting-item-stats');
const craftingOptionsDiv = document.getElementById('crafting-options');
const craftingMaterialsListDiv = document.getElementById('crafting-materials-list');
//upgrades
const upgradeButtonList = document.getElementById('upgrade-list');
//tools
const toolButtonList = document.getElementById('tool-list');
let buttonUpgrades = document.getElementById(`button-upgrade`);
let upgradeDiv = document.getElementById(`upgrades`);
let buttonCrafting = document.getElementById(`button-crafting`);
let craftingDiv = document.getElementById(`crafting`);
let buttonQuests = document.getElementById(`button-quests`);
let questDiv = document.getElementById(`quests`);
let buttonWorld = document.getElementById(`button-world`);
let worldDiv = document.getElementById(`world`);
let buttonTools = document.getElementById(`button-tool`);
let toolDiv = document.getElementById(`tools`);
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
        button: buttonUpgrades
    },
    {
        name: 'crafting',
        div: craftingDiv,
        button: buttonCrafting
    },
    {
        name: 'quests',
        div: questDiv,
        button: buttonQuests
    },
    {
        name: 'world',
        div: worldDiv,
        button: buttonWorld
    },
    {
        name: 'tools',
        div: toolDiv,
        button: buttonTools
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
    gearCountMax: 100,
    //resources
    maxInventory: 200,
    //player state
    unlockedWorkers: false,
    unlockedGear: false,
    unlockedCraftingButton: false,
    unlockedCrafting: false,
    unlockedMaterials: false,
    unlockedGems: false,
    //"Spade" | "Mace" | "Potion" | "Hammer" | "Knife" | "Spear" | "Chisel" | "Quill" | "Dice" | "Scales" | "Holy Symbol" | "Scroll" | "Pickaxe" | "Axe";
    unlockedGearType: {
        Pickaxe: false,
        Axe: false,
        Spade: false,
        Hammer: false,
        Potion: false,
        Scroll: false,
        Knife: false,
        Spear: false,
        Mace: false,
        Chisel: false,
        Quill: false,
        Dice: false,
        Scales: false,
        HolySymbol: false,
        Bow: false,
    },
    unlockedBaseMaterial: {
        Wooden: false,
        Copper: false,
        Silver: false,
        Gold: false
    },
    creationMaterial: 'Scrap',
    craftingItemsMax: 1
};
let craftWork = 0;
let upgradePoints = 0;
