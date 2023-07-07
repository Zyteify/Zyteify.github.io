//check to see if we are on dev environment 
if (window.location.hostname == "127.0.0.1") {

    //gearcrafting
    for (let i = 0; i < gearTypes.length; i++) {
        //create a button for each gear type
        let button = document.createElement('button');
        button.innerHTML = gearTypes[i];
        button.onclick = function () {
            createGear("Weapon", gearTypes[i]);
        }
        let craftingContainer: HTMLElement = <HTMLElement>document.getElementById('materials');
        craftingContainer.appendChild(button);
    }

    //resources
    for (let i = 0; i < resources.length; i++) {
        //create a button for each gear type
        let button = document.createElement('button');
        button.innerHTML = resources[i].icon;
        button.onclick = function () {
            resources[i].amount += 1000
        }
        let resourcesContainer: HTMLElement = <HTMLElement>document.getElementById('resources');
        resourcesContainer.appendChild(button);
    }

    //crafting
    let buttonCrafting = document.createElement('button');
    buttonCrafting.innerHTML = '🔨';
    buttonCrafting.onclick = function () {
        craftResource += 1000
        updateCraftButton();
    }
    let craftingContainer: HTMLElement = <HTMLElement>document.getElementById('materials');
    craftingContainer.appendChild(buttonCrafting);
    updateCraftButton();

    let buttonUnlockAll = document.createElement('button');
    buttonUnlockAll.innerHTML = 'Unlock All';
    let upgradeDiv: HTMLElement = <HTMLElement>document.getElementById('upgrades');
    upgradeDiv.appendChild(buttonUnlockAll);
    buttonUnlockAll.onclick = function () {

        for (let i = 0; i < resources.length; i++) {
            resources[i].amount += 1000
        }

        //loop through all upgrades and unlock them
        for (let i = 0; i < upgradeList.length; i++) {
            upgradeList[i].upgrade();
            unlockUpgrades();
            if(fakeBegs < 3 && fakeBegs < game.gearCountMax){
                unlockStarterGear();
            }
            
        }

        unlockCrafting();
    }
}

