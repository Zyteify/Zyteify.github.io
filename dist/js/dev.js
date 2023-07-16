"use strict";
let dev = false;
if (window.location.hostname == "127.0.0.1" || window.location.hostname == "localhost") {
    dev = true;
}
dev = false;
function unlockDev() {
    let craftingContainer = document.getElementById('materials');
    let gearCraftingDiv = document.createElement('div');
    gearCraftingDiv.classList.add('dev-div');
    gearCraftingDiv.classList.add('dev');
    craftingContainer.appendChild(gearCraftingDiv);
    //gearcrafting
    for (let i = 0; i < gearTypes.length; i++) {
        //create a button for each gear type
        let button = document.createElement('button');
        button.innerHTML = gearTypes[i];
        button.onclick = function () {
            createGear("Weapon", gearTypes[i]);
        };
        gearCraftingDiv.appendChild(button);
    }
    let resourcesContainer = document.getElementById('resources');
    let resourceContainerDiv = document.createElement('div');
    resourceContainerDiv.classList.add('dev-div');
    resourceContainerDiv.classList.add('dev');
    resourcesContainer.appendChild(resourceContainerDiv);
    //resources
    for (let i = 0; i < resources.length; i++) {
        //create a button for each gear type
        let button = document.createElement('button');
        button.innerHTML = resources[i].name;
        button.onclick = function () {
            resources[i].amount += 1000;
        };
        resourceContainerDiv.appendChild(button);
    }
    //crafting
    let buttonCrafting = document.createElement('button');
    buttonCrafting.classList.add('dev');
    buttonCrafting.innerHTML = '🔨';
    buttonCrafting.onclick = function () {
        craftWork += 1000;
        updateCraftButton();
    };
    craftingContainer.appendChild(buttonCrafting);
    updateCraftButton();
    let buttonUnlockAll = document.createElement('button');
    buttonUnlockAll.innerHTML = 'Unlock All';
    buttonUnlockAll.classList.add('dev');
    let upgradeDiv = document.getElementById('upgrades');
    upgradeDiv.appendChild(buttonUnlockAll);
    buttonUnlockAll.onclick = function () {
        devAll();
    };
}
function devAll() {
    for (let i = 0; i < resources.length; i++) {
        resources[i].amount += 1000;
    }
    //loop through all upgrades and unlock them
    for (let i = 0; i < upgrades.length; i++) {
        upgrades[i].upgrade();
    }
    displayAll();
}
if (dev) {
    unlockDev();
}
