"use strict";
function displayText() {
    //game-time
    days.innerHTML = `day ${game.days.toString()}`;
    hours.innerHTML = game.hours.toString();
    hours.innerHTML = convertHoursToTime(game.hours);
    //workers
    //worker-count-current
    workerCountCurrent.innerHTML = game.workerCountCurrent.toString();
    //worker-count-max
    workerCountMax.innerHTML = game.workerCountMax.toString();
    //gear
    //gear-count-current
    gearCountCurrent.innerHTML = items.length.toString();
    //gear-count-max
    gearCountMax.innerHTML = game.gearCountMax.toString();
    //crafting
    //crafting-progress
    materialsResource.innerHTML = (`🔨 ${craftWork.toString()}`);
    updateEventListeners();
    displayResources();
    showUpgrades();
    showBegging();
    displayGems();
    updateCraftButton();
}
displayResources();
function displayGear() {
    //each item in items
    for (let i = 0; i < items.length; i++) {
        items[i].setParentDiv(gearListContainer);
        items[i].resetDiv();
    }
    //and each item in craftingItems
    for (let i = 0; i < craftingItems.length; i++) {
        craftingItems[i].setParentDiv(craftingItemSectionDiv);
        craftingItems[i].resetDiv();
    }
    for (let i = 0; i < workers.length; i++) {
        if (workers[i].weapon[0] != null) {
            workers[i].weapon[0]?.setParentDiv(workers[i].gearDiv);
            workers[i].weapon[0]?.resetDiv();
        }
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
        let resourceName = resources[i].name;
        paragraph.innerHTML = resources[i].icon + " " + resources[i].amount;
        if (!resources[i].active) {
            paragraph.style.display = "none";
        }
        else {
            paragraph.style.display = "block";
        }
    }
}
function displayGems() {
    //loop through each resource and create a paragraph element for them if it doesn't exist
    for (let i = 0; i < gems.length; i++) {
        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("gem" + gems[i].name);
        if (paragraph == null) {
            paragraph = document.createElement('p');
            paragraph.id = "gem" + gems[i].name;
            paragraph.className = "gem";
            const container = document.getElementById('materials-list');
            container.appendChild(paragraph);
        }
        let resourceName = gems[i].name;
        paragraph.innerHTML = gems[i].icon + " " + gems[i].amount;
        if (!gems[i].active) {
            paragraph.style.display = "none";
        }
        else {
            paragraph.style.display = "block";
        }
    }
}
function emptyGearDisplay() {
    const container = gearListContainer;
    container.innerHTML = "";
    displayGear();
    controlCraftingButtons();
}
function showUpgrades() {
    for (let i = 0; i < upgradeList.length; i++) {
        upgradeList[i].display();
    }
}
function showBegging() {
    for (let i = 0; i < begList.length; i++) {
        begList[i].display();
    }
}
function setTextfromAffixes(stringText, stringValue) {
    //get the position to put the value of the stat by the #
    let position = stringText.search("#");
    let text = 'ERROR';
    //if the position is -1, then there is no # in the stat
    if (position == -1) {
        text = `${stringText}`;
    }
    //if the position is 0, then the # is at the beginning of the stat
    else if (position == 0) {
        text = `${stringValue}${stringText.slice(1)}`;
    }
    //if the position is at the end of the stat
    else if (position == stringText.length - 1) {
        text = `${stringText.slice(0, -1)}${stringValue}`;
    }
    //if the position is in the middle of the stat
    else {
        text = `${stringText.slice(0, position)}${stringValue}${stringText.slice(position + 1)}`;
    }
    return text;
}
