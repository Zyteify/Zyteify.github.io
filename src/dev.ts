//for development purposes
for (let i = 0; i < gearTypes.length; i++) {
    //create a button for each gear type
    let button = document.createElement('button');
    button.innerHTML = gearTypes[i];
    button.onclick = function () {
        createGear("Weapon", gearTypes[i]);
    }
    let craftingContainer: HTMLElement = <HTMLElement>document.getElementById('crafting');
    craftingContainer.appendChild(button);
}

//for development purposes
for (let i = 0; i < resources.length; i++) {
    //create a button for each gear type
    let button = document.createElement('button');
    button.innerHTML = resources[i].icon;
    button.onclick = function () {
        resources[i].amount += 10
    }
    let resourcesContainer: HTMLElement = <HTMLElement>document.getElementById('resources');
    resourcesContainer.appendChild(button);
}