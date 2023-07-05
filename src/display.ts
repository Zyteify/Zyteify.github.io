function displayText() {
    //game-time
    days.innerHTML = `day ${game.days.toString()}`
    hours.innerHTML = game.hours.toString();
    hours.innerHTML = convertHoursToTime(game.hours);
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
    craftingResource.innerHTML = (`🔨 ${craftResource.toString()}`);

    updateEventListeners()
    displayResources()
    showUpgrades()
    showBegging()
    displayGems()

}

displayResources()



function displayGear() {
    for (let i = 0; i < items.length; i++) {
        items[i].setParentDiv(document.getElementById('gear-list') as HTMLDivElement)
    }
}

function displayResources() {

    //loop through each resource and create a paragraph element for them if it doesn't exist
    for (let i = 0; i < resources.length; i++) {
        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("resource" + resources[i].name)
        if (paragraph == null) {

            paragraph = document.createElement('p');
            paragraph.id = "resource" + resources[i].name;
            paragraph.className = "resource"

            const container = document.getElementById('resource-list') as HTMLDivElement;
            container.appendChild(paragraph);
        }
        let resourceName = ResourceType[resources[i].name]
        paragraph.innerHTML = resources[i].icon+ " " + resources[i].amount;
        if(!resources[i].active){
            paragraph.style.display = "none";
        }
        else{
            paragraph.style.display = "block";
        }
    }
}

function displayGems() {

    //loop through each resource and create a paragraph element for them if it doesn't exist
    for (let i = 0; i < gems.length; i++) {
        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("gem" + gems[i].name)
        if (paragraph == null) {

            paragraph = document.createElement('p');
            paragraph.id = "gem" + gems[i].name;
            paragraph.className = "gem"

            const container = document.getElementById('materials-list') as HTMLDivElement;
            container.appendChild(paragraph);
        }
        let resourceName = gems[i].name
        paragraph.innerHTML = gems[i].icon+ " " + gems[i].amount;
        if(!gems[i].active){
            paragraph.style.display = "none";
        }
        else{
            paragraph.style.display = "block";
        }
    }
}

function emptyGearDisplay() {
    const container = document.getElementById('gear-list') as HTMLDivElement;
    container.innerHTML = "";
    displayGear()
}

function showUpgrades() {
    for (let i = 0; i < upgradeList.length; i++) {
        upgradeList[i].display()
    }
}

function showBegging() {
    for (let i = 0; i < begList.length; i++) {
        begList[i].display()
    }
}