"use strict";
let exportString = "";
function exportAll() {
    exportString = "";
    exportString += exportGameState();
    exportString += exportResources();
    exportString += exportUpgrades();
    exportString += exportGems();
    exportString += exportGear();
    exportString += exportWorkers();
    exportString += exportStatics();
}
function exportGameState() {
    let exportString = "";
    exportString += JSON.stringify(game) + "\n";
    localStorage.setItem("gameState", exportString);
    return exportString;
}
function exportResources() {
    let exportString = "";
    for (let i = 0; i < resources.length; i++) {
        exportString += JSON.stringify(resources[i].export()) + "\n";
    }
    localStorage.setItem("resources", exportString);
    return exportString;
}
function exportUpgrades() {
    let exportString = "";
    for (let i = 0; i < upgrades.length; i++) {
        exportString += JSON.stringify(upgrades[i].export()) + "\n";
    }
    localStorage.setItem("upgrades", exportString);
    return exportString;
}
function exportGems() {
    let exportString = "";
    for (let i = 0; i < gems.length; i++) {
        exportString += JSON.stringify(gems[i].export()) + "\n";
    }
    localStorage.setItem("gems", exportString);
    return exportString;
}
function exportGear() {
    let exportString = "";
    for (let i = 0; i < itemsInventory.length; i++) {
        exportString += JSON.stringify(itemsInventory[i].export()) + "\n";
    }
    for (let i = 0; i < itemsCrafting.length; i++) {
        exportString += JSON.stringify(itemsCrafting[i].export()) + "\n";
    }
    //todo add deleted items
    localStorage.setItem("gear", exportString);
    return exportString;
}
function exportWorkers() {
    let exportString = "";
    for (let i = 0; i < workers.length; i++) {
        exportString += JSON.stringify(workers[i].export()) + "\n";
    }
    localStorage.setItem("workers", exportString);
    return exportString;
}
function exportStatics() {
    let exportString = "";
    let statics = {
        workSpeedUpgradeable: WorkerClass.workSpeedUpgradeable
    };
    exportString += JSON.stringify(statics) + "\n";
    localStorage.setItem("statics", exportString);
    return exportString;
}
function removeAllFromArray(array) {
    let arrayCopy = array.slice();
    for (let i = 0; i < arrayCopy.length; i++) {
        arrayCopy[i].remove();
    }
}
function importAll(replace) {
    if (replace) {
        removeAllFromArray(resources);
        removeAllFromArray(gems);
        removeAllFromArray(itemsInventory);
        removeAllFromArray(itemsCrafting);
        removeAllFromArray(workers);
        removeAllFromArray(upgrades);
    }
    importGameState();
    importResources();
    importUpgrades();
    importGems();
    importGear();
    importStatics();
    importWorkers();
    showMainDivs();
}
function importGameState() {
    let data = localStorage.getItem("gameState");
    if (data != null) {
        let importGameState = JSON.parse(data);
        game = importGameState;
    }
}
let importDataResources = [];
function importResources() {
    let data = localStorage.getItem("resources");
    if (data != null) {
        let dataArray = data.split("\n");
        for (let i = 0; i < dataArray.length - 1; i++) {
            let importResource = JSON.parse(dataArray[i]);
            importDataResources.push(importResource);
            let resource = new Resource(importResource.name, importResource.amount, resourceList);
            resource.display;
            resource.active = importResource.active;
            resources.push(resource);
        }
    }
}
function importUpgrades() {
    let data = localStorage.getItem("upgrades");
    if (data != null) {
        let dataArray = data.split("\n");
        for (let i = 0; i < dataArray.length - 1; i++) {
            let importUpgrade = JSON.parse(dataArray[i]);
            let upgrade = new Upgrade(importUpgrade.name, importUpgrade.active, importUpgrade.level, importUpgrade.maxLevel, importUpgrade.upgradeAction, importUpgrade.tags, importUpgrade.unlocks);
            for (let j = 0; j < importUpgrade.resourcesRequired.length; j++) {
                let resource = getResourceByName(importUpgrade.resourcesRequired[j].name);
                if (resource) {
                    upgrade.addResourceCost(resource);
                }
            }
            upgrade.display();
            upgrades.push(upgrade);
        }
    }
}
function importGems() {
    let data = localStorage.getItem("gems");
    if (data != null) {
        let dataArray = data.split("\n");
        for (let i = 0; i < dataArray.length - 1; i++) {
            let importGem = JSON.parse(dataArray[i]);
            let gem = new Gem(importGem.name, importGem.imageName, importGem.amount, importGem.active);
            gem.display();
            gems.push(gem);
        }
    }
}
function importGear() {
    let data = localStorage.getItem("gear");
    if (data != null) {
        let dataArray = data.split("\n");
        for (let i = 0; i < dataArray.length - 1; i++) {
            let importGear = JSON.parse(dataArray[i]);
            let baseType = findBaseTypeByNameandGearType(importGear.baseType.name, importGear.baseType.gearType);
            let item = new Item(importGear.type, baseType, importGear.rarity, importGear.full);
            switch (importGear.containerNumber) {
                case -2:
                    item.setParentDiv(gearListContainer);
                    itemsInventory.push(item);
                    break;
                case -1:
                    item.setParentDiv(craftingItemSectionDiv);
                    itemsCrafting.push(item);
                    break;
                default:
                    console.log("importGear: containerNumber not found in import list");
                    break;
            }
        }
    }
}
//use calculateProperties in workerclass after this
function importStatics() {
    let data = localStorage.getItem("statics");
    if (data != null) {
        let importStatics = JSON.parse(data);
        WorkerClass.workSpeedUpgradeable = importStatics.workSpeedUpgradeable;
    }
}
function importWorkers() {
    let data = localStorage.getItem("workers");
    if (data != null) {
        let dataArray = data.split("\n");
        for (let i = 0; i < dataArray.length - 1; i++) {
            let importWorker = JSON.parse(dataArray[i]);
            let worker = new WorkerClass(importWorker.full);
            for (let j = 0; j < importWorker.weapon.length; j++) {
                let baseType = findBaseTypeByNameandGearType(importWorker.weapon[j].baseType.name, importWorker.weapon[j].baseType.gearType);
                let item = new Item(importWorker.weapon[j].type, baseType, importWorker.weapon[j].rarity, importWorker.weapon[j].full);
                item.setParentDiv(worker.div);
                item.resetDiv();
                worker.equipItem(item);
            }
            workers.push(worker);
        }
    }
}
//check to see if main divs should be shown based on the game state
function showMainDivs() {
    if (game.unlockedCrafting) {
        craftingDiv.style.display = "";
    }
    else {
        craftingDiv.style.display = "none";
    }
    if (game.unlockedMaterials) {
        materialsDiv.style.display = "";
    }
    else {
        materialsDiv.style.display = "none";
    }
    if (game.unlockedGear) {
        gearContainer.style.display = "";
    }
    else {
        gearContainer.style.display = "none";
    }
    if (game.unlockedWorkers) {
        workerContainer.style.display = "";
    }
    else {
        workerContainer.style.display = "none";
    }
}
