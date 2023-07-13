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


    //list of upgrades that are set to be locked initially based on the tags
    static unavailableUpgrades: String[] = ["Worker", "Gear", "WorkHire"];
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
            case "Increase Gear Slots":
                this.costMultiplier = 1.5;
                break
            default:
                this.costMultiplier = 2;
                break
        }
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
        let button = document.getElementById('upgrade' + this.name) as HTMLButtonElement;

        if (!button) {
            button = document.createElement('button');
            button.id = 'upgrade' + this.name;
            button.className = 'upgrade';

            //create a span element for the button
            const span = document.createElement('span');
            span.id = 'upgrade' + this.name + 'span';
            span.className = 'upgrade-span';
            button.appendChild(span);

            // Set the button text to the upgrade name, resouce required, and cost
            span.textContent = `${this.name}  ${this.level}/${this.maxLevel})`;

            //create a span element for the button
            button.appendChild(this.resourceSpan);

            //create a div element for the button inside the span
            const div = document.createElement('div');
            div.id = 'upgrade-span-resource' + this.name + 'div';
            div.className = 'upgrade-span-resource-div';
            this.resourceSpan.appendChild(div);

            upgradeButtonList.appendChild(button);

            button.onclick = () => {
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

    displayActive(): void {
        let button = document.getElementById('upgrade' + this.name) as HTMLButtonElement;
        if (this.active) {
            //remove the none display
            button.style.display = "";
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
                if (this.resourcesRequired[i].name == resources[j].name && this.resourcesRequired[i].amount <= resources[j].amount) {
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
                if (this.resourcesRequired[i].name == resources[j].name && this.resourcesRequired[i].amount <= resources[j].amount) {
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


}


function getUpgradeByName(name: string) {
    for (let i = 0; i < upgradeList.length; i++) {
        if (upgradeList[i].name === name) {
            return upgradeList[i];
        }
    }
    return null;
}
