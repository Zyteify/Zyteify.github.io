"use strict";
function increaseWorkerSpeed() {
    WorkerClass.workSpeedUpgradeable += 5;
    //loop through each worker and display
    for (let i = 0; i < workers.length; i++) {
        workers[i].energy += 5;
        workers[i].calculateMods();
    }
    displayUpgrades();
}
//Increase Worker Inventory
function increaseWorkerInventory() {
    WorkerClass.maxInventory += 50;
    displayUpgrades();
}
//Increase Stockpile
function increaseStockpile() {
    /* StockpileClass.maxInventory += 100; */
    displayUpgrades();
}
//Increase Deposit Speed
function increaseDepositSpeed() {
    WorkerClass.depositAmount += 1;
    displayUpgrades();
}
//Hire Beggar
function unlockWorkers() {
    if (!game.unlockedWorkers) {
        workerContainer.classList.remove('initial-hide');
        game.unlockedWorkers = true;
    }
    displayUpgrades();
}
function createWorker() {
    unlockWorkers();
    //create a new worker
    let newWorker = new WorkerClass();
    //add the new worker to the list of workers
    workers.push(newWorker);
    return newWorker;
}
//hire farmer
function unlockFarmer() {
    //create a new worker
    let worker = createWorker();
    let gearType = "Spade";
    let baseMaterial = "Scrap";
    let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType);
    createGear(baseType, 'Starter', worker.weapon, worker);
    unlockCraftingButtonTypeSelectable(gearType, "gearType");
    displayUpgrades();
}
//Hire Gambler
function unlockGambler() {
    //create a new worker
    let worker = createWorker();
    let gearType = "Dice";
    let baseMaterial = "Scrap";
    let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType);
    createGear(baseType, 'Starter', worker.weapon, worker);
    unlockCraftingButtonTypeSelectable(gearType, "gearType");
    displayUpgrades();
}
//Hire Woodcutter
function unlockWoodcutter() {
    //create a new worker
    let worker = createWorker();
    let gearType = "Axe";
    let baseMaterial = "Scrap";
    let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType);
    createGear(baseType, 'Starter', worker.weapon, worker);
    let wood = getResourceByName('wood');
    wood.active = true;
    unlockCraftingButtonTypeSelectable(gearType, "gearType");
    displayUpgrades();
}
// Hire Miner
function unlockMiner() {
    //create a new worker
    let worker = createWorker();
    let gearType = "Pickaxe";
    let baseMaterial = "Scrap";
    let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType);
    createGear(baseType, 'Starter', worker.weapon, worker);
    let stone = getResourceByName('stone');
    stone.active = true;
    let copper = getResourceByName('copper');
    copper.active = true;
    let silver = getResourceByName('silver');
    silver.active = true;
    let gold = getResourceByName('gold');
    gold.active = true;
    unlockCraftingButtonTypeSelectable(gearType, "gearType");
    displayUpgrades();
}
// Hire Gemcutter
function unlockGemcutter() {
    //create a new worker
    let worker = createWorker();
    let gearType = "Chisel";
    let baseMaterial = "Scrap";
    let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType);
    createGear(baseType, 'Starter', worker.weapon, worker);
    unlockCraftingButtonTypeSelectable(gearType, "gearType");
    unlockMaterials();
    unlockGems();
    displayUpgrades();
}
// Hire Blacksmith
function unlockBlacksmith() {
    //create a new worker
    let worker = createWorker();
    let gearType = "Hammer";
    let baseMaterial = "Scrap";
    let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType);
    createGear(baseType, 'Starter', worker.weapon, worker);
    unlockCraftingButtonTypeSelectable(gearType, "gearType");
    unlockGear();
    unlockCrafting();
    displayUpgrades();
}
// Hire Merchant
function unlockMerchant() {
    //create a new worker
    let worker = createWorker();
    let gearType = "Scales";
    let baseMaterial = "Scrap";
    let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType);
    createGear(baseType, 'Starter', worker.weapon, worker);
    unlockCraftingButtonTypeSelectable(gearType, "gearType");
    displayUpgrades();
}
// Hire Priest
function unlockPriest() {
    //create a new worker
    let worker = createWorker();
    let gearType = "Holy Symbol";
    let baseMaterial = "Scrap";
    let baseType = findBaseTypeByNameandGearType(baseMaterial, gearType);
    createGear(baseType, 'Starter', worker.weapon, worker);
    unlockCraftingButtonTypeSelectable(gearType, "gearType");
    displayUpgrades();
}
function unlockGear() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedGear) {
        game.unlockedGear = true;
        gearContainer.classList.remove('initial-hide');
    }
}
function unlockMaterials() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedMaterials) {
        materialsDiv.classList.remove('initial-hide');
        game.unlockedMaterials = true;
        flashElementGood(materialsDiv);
        displayCraftWork();
    }
}
function unlockGems() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedGems) {
        materialsGemList.classList.remove('initial-hide');
        game.unlockedGems = true;
        flashElementGood(materialsGemList);
        flashElementGood(buttonCrafting);
        //add 10 basic gems
        let gem = getGemByName("1");
        gem.amount += 10;
        displayGems();
    }
}
function unlockCrafting() {
    //if this upgrade is to unlock a div, show it
    if (!game.unlockedCrafting) {
        craftingDiv.classList.remove('initial-hide');
        buttonCrafting.classList.remove('initial-hide');
        game.unlockedCrafting = true;
        flashElementGood(buttonCrafting);
        unlockCraftingButtonTypeActive("Wooden", "baseTypeName");
    }
}
function unlockWooden() {
    if (!game.unlockedBaseMaterial.Wooden) {
        game.unlockedBaseMaterial.Wooden = true;
        unlockCraftingButtonTypeSelectable("Wooden", "baseTypeName");
        unlockCraftingButtonTypeActive("Wooden", "baseTypeName");
        flashElementGood(buttonCrafting);
    }
}
function unlockCopper() {
    if (!game.unlockedBaseMaterial.Copper) {
        game.unlockedBaseMaterial.Copper = true;
        unlockCraftingButtonTypeSelectable("Copper", "baseTypeName");
        unlockCraftingButtonTypeActive("Copper", "baseTypeName");
        flashElementGood(buttonCrafting);
    }
}
function unlockSilver() {
    if (!game.unlockedBaseMaterial.Silver) {
        game.unlockedBaseMaterial.Silver = true;
        unlockCraftingButtonTypeSelectable("Silver", "baseTypeName");
        unlockCraftingButtonTypeActive("Silver", "baseTypeName");
        flashElementGood(buttonCrafting);
    }
}
function unlockGolden() {
    if (!game.unlockedBaseMaterial.Gold) {
        game.unlockedBaseMaterial.Gold = true;
        unlockCraftingButtonTypeSelectable("Golden", "baseTypeName");
        unlockCraftingButtonTypeActive("Golden", "baseTypeName");
        flashElementGood(buttonCrafting);
    }
}
function unlockHolySymbol() {
}
//loop through the list of upgrades and if they are not available, make them available
function unlockUpgrades() {
    for (let i = 0; i < upgrades.length; i++) {
        if (upgrades[i].active == false) {
            //if all the tags arent in the unavailable upgrades list, make it available
            let requiredUpgrade = false;
            if (upgrades[i].requiredUpgrade.length > 0) {
                //if the required upgrade is in the list of available upgrades, make it available
                for (let j = 0; j < Upgrade.availableUpgrades.length; j++) {
                    if (Upgrade.availableUpgrades[j] == upgrades[i].requiredUpgrade) {
                        requiredUpgrade = true;
                    }
                }
            }
            if (requiredUpgrade) {
                upgrades[i].active = true;
                upgrades[i].displayActive();
            }
        }
    }
    displayUpgrades();
}
