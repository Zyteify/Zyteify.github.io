"use strict";
//check to see if we are on dev environment 
if (window.location.hostname == "127.0.0.1") {
    //gearcrafting
    for (let i = 0; i < gearTypes.length; i++) {
        //create a button for each gear type
        let button = document.createElement('button');
        button.innerHTML = gearTypes[i];
        button.onclick = function () {
            createGear("Weapon", gearTypes[i]);
        };
        let craftingContainer = document.getElementById('crafting');
        craftingContainer.appendChild(button);
    }
    //resources
    for (let i = 0; i < resources.length; i++) {
        //create a button for each gear type
        let button = document.createElement('button');
        button.innerHTML = resources[i].icon;
        button.onclick = function () {
            resources[i].amount += 1000;
        };
        let resourcesContainer = document.getElementById('resources');
        resourcesContainer.appendChild(button);
    }
    //crafting
    let buttonCrafting = document.createElement('button');
    buttonCrafting.innerHTML = '🔨';
    buttonCrafting.onclick = function () {
        craftResource += 1000;
        updateCraftingButton();
    };
    let craftingContainer = document.getElementById('crafting');
    craftingContainer.appendChild(buttonCrafting);
    updateCraftingButton();
}
