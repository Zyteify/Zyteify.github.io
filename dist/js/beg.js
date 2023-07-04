"use strict";
class Beg {
    name;
    resource;
    amount;
    maxAmount;
    constructor(name, resource, amount, maxAmount) {
        this.name = name;
        this.resource = resource;
        this.amount = amount;
        this.maxAmount = maxAmount;
    }
    getRequiredResource(name) {
        let resource = getResourceByName(name);
        return resource;
    }
    beg() {
        let resourceGlobal = this.getRequiredResource(this.resource.name);
        if (resourceGlobal.amount < this.maxAmount) {
            resourceGlobal.amount += this.amount;
        }
    }
    isAvailable() {
        let ready = false;
        let resourceGlobal = this.getRequiredResource(this.resource.name);
        if (resourceGlobal.amount < this.maxAmount) {
            ready = true;
        }
        return ready;
    }
    display() {
        const container = document.getElementById('beg-list');
        let button = document.getElementById('beg' + this.name);
        if (!button) {
            button = document.createElement('button');
            button.id = "beg" + this.name;
            button.className = "beg";
            let resourceText = "";
            switch (this.resource.name) {
                case ResourceType.coins:
                    resourceText = `Beg for ${this.amount} ${this.resource.icon}`;
                    break;
                default:
                    resourceText = `Scavange for ${this.amount} ${this.resource.icon}`;
                    break;
            }
            button.innerHTML = resourceText;
            button.onclick = () => {
                // Call upgrade function with the name of the upgrade
                this.beg();
            };
            container.appendChild(button);
        }
        if (!this.isAvailable()) {
            button.disabled = true;
        }
        else {
            button.disabled = false;
        }
    }
}
let fakeBegs = 0;
let fakeBegButton = document.createElement('button');
function createFakeBegButton() {
    //create a button that give a certain gear piece
    const container = document.getElementById('beg-list');
    //create a button
    fakeBegButton.id = "begFake";
    fakeBegButton.className = "beg";
    fakeBegButton.innerHTML = "Salvange Gear";
    container.appendChild(fakeBegButton);
    fakeBegButton.onclick = () => {
        // Call upgrade function with the name of the upgrade
        let gearCreation = false;
        switch (fakeBegs) {
            case 0:
                gearCreation = createGear("Weapon", "Hoe");
                if (gearCreation) {
                    game.unlockedHoe = true;
                    fakeBegs++;
                }
                break;
            case 1:
                gearCreation = createGear("Weapon", "Axe");
                if (gearCreation) {
                    game.unlockedAxe = true;
                    setResourceActive(ResourceType.wood);
                    fakeBegs++;
                }
                break;
            case 2:
                gearCreation = createGear("Weapon", "Hammer");
                if (gearCreation) {
                    game.unlockedHammer = true;
                    fakeBegs++;
                }
                break;
            default:
                console.log('error in fakeBegs switch');
                break;
        }
        showFakeBegButton();
    };
}
function showFakeBegButton() {
    if (game.gearCountMax > fakeBegs && !game.unlockedHammer) {
        fakeBegButton.style.display = "block";
    }
    else {
        fakeBegButton.style.display = "none";
    }
}
