"use strict";
function displayText() {
    //game-time
    days.innerHTML = game.days.toString();
    hours.innerHTML = game.hours.toString();
    minutes.innerHTML = game.minutes.toString();
    //game-time-speed
    time_multiplier.innerHTML = game.time_multiplier.toString();
    //workers
    //worker-count-current
    workerCountCurrent.innerHTML = game.workerCountCurrent.toString();
    //worker-count-max
    workerCountMax.innerHTML = game.workerCountMax.toString();
    //gear
    //gear-count-current
    gearCountCurrent.innerHTML = game.gearCountCurrent.toString();
    //gear-count-max
    gearCountMax.innerHTML = game.gearCountMax.toString();
    //crafting
    //crafting-progress
    craftingProgress.innerHTML = craftProgress.toString();
    updateEventListeners();
    displayResources();
}
function displayGear() {
    for (let i = 0; i < items.length; i++) {
        items[i].Display();
    }
}
function displayResources() {
    //loop through each resource and create a paragraph element for them if it doesn't exist
    for (let i = 0; i < resources.length; i++) {
        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("resource" + resources[i].name);
        if (paragraph == null) {
            paragraph = document.createElement('p');
            paragraph.id = "resource" + resources[i].name;
            paragraph.className = "resource";
            const container = document.getElementById('resource-list');
            container.appendChild(paragraph);
        }
        let resourceName = ResourceType[resources[i].name];
        paragraph.innerHTML = resources[i].icon + " " + resourceName + ": " + resources[i].amount;
    }
}
function emptyGearDisplay() {
    const container = document.getElementById('gear-list');
    container.innerHTML = "";
    displayGear();
}
