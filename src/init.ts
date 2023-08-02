//get html elements for assigning text
//game-time
const days = <HTMLElement>document.getElementById('game-time-days');
const hours = <HTMLElement>document.getElementById('game-time-hours');

//workers
const workerContainer = document.getElementById('workers') as HTMLDivElement;
//worker-count-current
const workerCount = <HTMLElement>document.getElementById('worker-count');
const workerCountCurrent = <HTMLElement>document.getElementById('worker-count-current');
//worker-count-max
const workerCountMax = <HTMLElement>document.getElementById('worker-count-max');
//worker-list
const workerList = <HTMLDivElement>document.getElementById('worker-list');


//Materials
const materialsDiv = <HTMLElement>document.getElementById('materials');



//Materials-create-gear
const materialsCreateGearButton = <HTMLButtonElement>document.getElementById('materials-create-gear');
//Materials-item-dropdown
const materialsGearSlotDropdown = <HTMLSelectElement>document.getElementById('material-gearslot-dropdown');
//Materials-item-dropdown
const materialsItemDropdown = <HTMLSelectElement>document.getElementById('material-basetypename-dropdown');
//Materials-gear-dropdown
const materialsGearDropdown = <HTMLSelectElement>document.getElementById('material-geartype-dropdown');
//Materials-progress
const materialsCraftWork = <HTMLElement>document.getElementById('materials-craft-work');
const materialsList = <HTMLElement>document.getElementById('materials-list');
const materialsGemList = document.getElementById('materials-gem-list') as HTMLDivElement;


//resources
const resourceList = document.getElementById('resource-list') as HTMLDivElement;

//gear
const gearContainer = document.getElementById('gear') as HTMLDivElement;
//gear
const gearListContainer = document.getElementById('gear-list') as HTMLDivElement;
/* //gear-count-current
const gearCountCurrent = <HTMLElement>document.getElementById('gear-count-current');
//gear-count-max
const gearCountMax = <HTMLElement>document.getElementById('gear-count-max'); */
//delete-div
const deleteDiv = <HTMLElement>document.getElementById('delete-div');

//crafting
//choose
const craftingChooseDiv = <HTMLElement>document.getElementById('crafting-choose-button');


const craftingItemSectionDiv = <HTMLDivElement>document.getElementById('crafting-item-section');
const craftingItemNameDiv = <HTMLElement>document.getElementById('crafting-item-name');
const craftingItemPictureDiv = <HTMLElement>document.getElementById('crafting-item-picture');
const craftingItemGearDiv = <HTMLElement>document.getElementById('crafting-item-gear');
const craftingItemStatsDiv = <HTMLElement>document.getElementById('crafting-item-stats');

const craftingOptionsDiv = <HTMLElement>document.getElementById('crafting-options');
const craftingMaterialsListDiv = <HTMLElement>document.getElementById('crafting-materials-list');

//upgrades
const upgradeButtonList = <HTMLDivElement>document.getElementById('upgrade-list');

//tools
const toolButtonList = <HTMLDivElement>document.getElementById('tool-list');

let buttonUpgrades = <HTMLDivElement>document.getElementById(`button-upgrade`);
let upgradeDiv = <HTMLDivElement>document.getElementById(`upgrades`);
let buttonCrafting = <HTMLDivElement>document.getElementById(`button-crafting`);
let craftingDiv = <HTMLDivElement>document.getElementById(`crafting`);
let buttonQuests = <HTMLDivElement>document.getElementById(`button-quests`);
let questDiv = <HTMLDivElement>document.getElementById(`quests`);
let buttonWorld = <HTMLDivElement>document.getElementById(`button-world`);
let worldDiv = <HTMLDivElement>document.getElementById(`world`);
let buttonTools = <HTMLDivElement>document.getElementById(`button-tool`);
let toolDiv = <HTMLDivElement>document.getElementById(`tools`);
let emptyDiv = <HTMLDivElement>document.getElementById(`empty`);

let buttonImageUpgrades = <HTMLImageElement>document.getElementById(`button-image-upgrade`);
let buttonImageCrafting = <HTMLImageElement>document.getElementById(`button-image-crafting`);
let buttonImageQuests = <HTMLImageElement>document.getElementById(`button-image-quests`);
let buttonImageWorld = <HTMLImageElement>document.getElementById(`button-image-world`);

//for the main section, which buttons control which div
let buttons: any[] = []
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
]

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

}

let craftWork = 0;

let upgradePoints = 0;