"use strict";
class Upgrade {
    name;
    cost;
    resourceRequired;
    level;
    maxLevel;
    active = true;
    upgradeAction;
    //list of upgrades that are set to be locked initially based on the tags
    static unavailableUpgrades = ["Worker", "Gear", "WorkHire"];
    unlocks = [];
    //tag the upgrade if it needs to be unlocked later
    tags = [];
    //the constructor for the upgrade class
    constructor(name, active, cost, level, resourceRequired, maxLevel, upgradeAction, tags, 
    //optional parameter
    unlocks) {
        this.active = active;
        this.name = name;
        this.cost = cost;
        this.level = level;
        this.resourceRequired = resourceRequired;
        this.maxLevel = maxLevel;
        this.upgradeAction = upgradeAction;
        this.tags = tags;
        //optional parameter
        if (unlocks) {
            this.unlocks = unlocks;
        }
    }
    upgrade() {
        let spent = false;
        if (this.level < this.maxLevel) {
            //spend the cost of the upgrade
            for (let i = 0; i < resources.length; i++) {
                if (resources[i].name == this.resourceRequired.name && resources[i].amount >= this.cost) {
                    resources[i].amount -= this.cost;
                    spent = true;
                }
            }
        }
        if (spent == false) {
            console.log("not enough resources");
        }
        else {
            this.level++;
            this.cost *= 2;
            console.log(`upgrading ${this.name} to level ${this.level}`);
        }
        this.upgradeAction();
        if (this.unlocks.length > 0) {
            //loop through the list of upgrades that are set to be unlocked
            for (let i = 0; i < this.unlocks.length; i++) {
                //remove it from the list of unavailable upgrades
                let index = Upgrade.unavailableUpgrades.indexOf(this.unlocks[i]);
                Upgrade.unavailableUpgrades.splice(index, 1);
            }
        }
        unlockUpgrades();
        //if this upgrade is to unlock a div, show it
        if (this.name == "Unlock Gear") {
            craftingDiv.style.display = "block";
        }
    }
    downgrade() {
        if (this.level > 0) {
            this.level--;
        }
    }
    isMaxLevel() {
        return this.level == this.maxLevel;
    }
    isAvailable() {
        let ready = false;
        let resourcesAvailable = false;
        let slotsAvailable = false;
        if (this.active == true && this.level >= 0 && this.level < this.maxLevel) {
            ready = true;
        }
        //check to see if the player has enough resources
        for (let i = 0; i < resources.length; i++) {
            if (resources[i].name == this.resourceRequired.name && resources[i].amount >= this.cost) {
                resourcesAvailable = true;
            }
        }
        //check to see if the player has slots available
        switch (this.name) {
            case "Hire Worker":
                if (game.workerCountCurrent < game.workerCountMax) {
                    slotsAvailable = true;
                }
                break;
            default:
                slotsAvailable = true;
                break;
        }
        let result = ready && resourcesAvailable && slotsAvailable;
        return result;
    }
    display() {
        let button = document.getElementById('upgrade' + this.name);
        if (!button) {
            button = document.createElement('button');
            button.id = 'upgrade' + this.name;
            button.className = 'upgrade';
            // Set the button text to the upgrade name, resouce required, and cost
            button.textContent = `${this.name}  ${this.level}/${this.maxLevel} (${this.resourceRequired.icon}${this.cost})`;
            const container = document.getElementById('upgrade-list');
            container.appendChild(button);
            button.onclick = () => {
                // Call upgrade function with the name of the upgrade
                this.upgrade();
            };
        }
        button.textContent = `${this.name}  ${this.level}/${this.maxLevel} (${this.resourceRequired.icon}${this.cost})`;
        //if the upgrade not available, make the button disabled
        if (!this.isAvailable()) {
            button.disabled = true;
        }
        else {
            button.disabled = false;
        }
        //if the upgrade is at max level or the upgrade is unavailable, hide the button
        if (this.isMaxLevel() || this.active == false) {
            button.style.display = "none";
        }
    }
    displayActive() {
        let button = document.getElementById('upgrade' + this.name);
        if (this.active) {
            button.style.display = "block";
        }
    }
}
