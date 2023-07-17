class Upgrade {
    name: string;
    resourcesRequired: Resource[] = [];
    level: number;
    maxLevel: number;
    active: boolean = true;
    costMultiplier: number = 2;
    upgradeAction: () => void;

    //display
    resourceSpan: HTMLElement;
    button: HTMLButtonElement;
    flashed: boolean = false;


    //list of upgrades that are set to be locked initially based on the tags
    static unavailableUpgrades: String[] = ["Worker", "Gear", "WorkHire", "Axe", "Hammer", "Pickaxe"];
    unlocks: string[] = [];

    //tag the upgrade if it needs to be unlocked later
    tags: string[] = [];

    constructor(name: string,
        active: boolean,
        level: number,
        maxLevel: number,
        upgradeAction: () => void,
        tags: string[],
        //optional parameter
        unlocks?: string[]) {

        this.active = active;
        this.name = name;
        this.level = level;
        this.maxLevel = maxLevel;
        this.upgradeAction = upgradeAction;
        this.tags = tags;
        //optional parameter
        if (unlocks) {
            this.unlocks = unlocks;
        }

        switch (this.name) {
            case "Unlock Gear":
                this.costMultiplier = 1;
                break
            case "Unlock Hammer":
                this.costMultiplier = 1;
                break
            case "Unlock Axe":
                this.costMultiplier = 1;
                break
            default:
                this.costMultiplier = 2;
                break
        }
        this.button = document.createElement('button');
        this.resourceSpan = document.createElement('span');
        this.resourceSpan.id = `upgrade-resource-span-${this.name}`;
        this.resourceSpan.className = 'upgrade-span-resource';

    }

    upgrade(): void {
        let spent = false;
        if (this.level < this.maxLevel) {
            //spend the cost of the upgrade
            spent = this.spendResources()
        }
        if (spent == false) {
            console.log(`not enough resources to upgrade ${this.name}`);
        }
        else {
            this.level++;
            this.increaseResourcesCost()


            this.upgradeAction();
            if (this.unlocks.length > 0) {
                //loop through the list of upgrades that are set to be unlocked
                for (let i = 0; i < this.unlocks.length; i++) {
                    //remove it from the list of unavailable upgrades
                    let index = Upgrade.unavailableUpgrades.indexOf(this.unlocks[i]);
                    Upgrade.unavailableUpgrades.splice(index, 1);
                }
            }
            unlockUpgrades()
            this.button.classList.remove('flash-border-good');

        }

    }

    downgrade(): void {
        if (this.level > 0) {
            this.level--;
        }
    }
    isMaxLevel(): boolean {
        return this.level == this.maxLevel;
    }

    isAvailable(): boolean {
        let ready = false;
        let resourcesAvailable = false;
        let slotsAvailable = false;
        if (this.active == true && this.level >= 0 && this.level < this.maxLevel) {
            ready = true;
        }
        //check to see if the player has enough resources
        resourcesAvailable = this.resourceAvailable()

        //check to see if the player has slots available
        switch (this.name) {
            case "Hire Worker":
                if (game.workerCountCurrent < game.workerCountMax) {
                    slotsAvailable = true;
                }
                break
            default:
                slotsAvailable = true;
                break
        }
        let result = ready && resourcesAvailable && slotsAvailable;
        return result;
    }

    display(): void {

        if (this.button.id == "") {
            this.button = document.createElement('button');
            this.button.id = 'upgrade' + this.name;
            this.button.className = 'upgrade';

            //create a span element for the button
            const span = document.createElement('span');
            span.id = 'upgrade' + this.name + 'span';
            span.className = 'upgrade-span';
            this.button.appendChild(span);

            // Set the button text to the upgrade name, resouce required, and cost
            span.textContent = `${this.name})`;

            //create a span element for the button
            this.button.appendChild(this.resourceSpan);

            //create a div element for the button inside the span
            const div = document.createElement('div');
            div.id = 'upgrade-span-resource' + this.name + 'div';
            div.className = 'upgrade-span-resource-div';
            this.resourceSpan.appendChild(div);

            upgradeButtonList.appendChild(this.button);

            this.button.onclick = () => {
                // Call upgrade function with the name of the upgrade
                this.upgrade();
            };
        }

        //loop through the resources required for the upgrade and display them
        for (let i = 0; i < this.resourcesRequired.length; i++) {
            this.resourcesRequired[i].display()
        }

        //if the upgrade not available, make the button disabled

        if (!this.isAvailable()) {
            this.button.disabled = true;
            this.flashed = false;
            this.button.classList.remove('flash-border-good');
        }
        else {
            this.button.disabled = false;
            if (!this.flashed) {
                this.flashed = true;
                flashUpgradeButton()
                flashElement(this.button)
            }
        }

        //if the upgrade is at max level or the upgrade is unavailable, hide the button
        if (this.isMaxLevel() || this.active == false) {
            this.button.style.display = "none";
        }

    }

    displayActive(): void {
        let button = document.getElementById('upgrade' + this.name) as HTMLButtonElement;
        if (this.active) {
            //remove the none display
            button.style.display = "";
            if (!flashUpgradeButton()) {
                flashElement(button)
            }
        }
    }

    addResourceCost(resource: Resource) {
        resource.active = true;
        this.resourcesRequired.push(resource)
    }

    resourceAvailable(): boolean {
        let result = false;
        for (let i = 0; i < this.resourcesRequired.length; i++) {
            for (let j = 0; j < resources.length; j++) {
                if (this.resourcesRequired[i].ResourceType == resources[j].ResourceType && this.resourcesRequired[i].amount <= resources[j].amount) {
                    result = true;
                }
            }
        }
        return result;
    }

    spendResources(): boolean {
        let spent = true;
        for (let i = 0; i < this.resourcesRequired.length; i++) {
            let resourcespent = false;
            for (let j = 0; j < resources.length; j++) {
                if (this.resourcesRequired[i].ResourceType == resources[j].ResourceType && this.resourcesRequired[i].amount <= resources[j].amount) {
                    resources[j].amount -= this.resourcesRequired[i].amount;
                    resourcespent = true;
                }
            }
            if (resourcespent == false) {
                spent = false;
            }
        }
        return spent;
    }

    increaseResourcesCost() {
        for (let i = 0; i < this.resourcesRequired.length; i++) {
            this.resourcesRequired[i].amount = Math.floor(this.resourcesRequired[i].amount * this.costMultiplier);
        }
    }

    remove() {
        //remove a upgrade from its container and list
        upgradeButtonList.removeChild(this.button);
        this.button.remove();

        let index = upgrades.indexOf(this);
        if (index > -1) {
            upgrades.splice(index, 1);
        }
    }

    export() {
        let upgrade = {
            name: this.name,
            resourcesRequired: this.resourcesRequired,
            level: this.level,
            maxLevel: this.maxLevel,
            active: this.active,
            costMultiplier: this.costMultiplier,
            upgradeAction: this.upgradeAction,
            tags: this.tags,
            unlocks: this.unlocks
        }
        return upgrade;
    }
}


function getUpgradeByName(name: string) {
    for (let i = 0; i < upgrades.length; i++) {
        if (upgrades[i].name === name) {
            return upgrades[i];
        }
    }
    return null;
}
