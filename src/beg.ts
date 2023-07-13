/* class Beg {
    name: string;
    resource: Resource;
    amount: number;
    maxAmount: number;
    constructor(name: string, resource: Resource, amount: number, maxAmount: number) {
        this.name = name;
        this.resource = resource;
        this.amount = amount;
        this.maxAmount = maxAmount;
    }
    getRequiredResource(name: ResourceType) {
        let resource = <Resource>getResourceByName(name);
        return resource;
    }
    beg() {
        let resourceGlobal = this.getRequiredResource(this.resource.name)
        if (resourceGlobal.amount < this.maxAmount) {
            resourceGlobal.amount += this.amount;
        }
    }
    isAvailable() {
        let ready = false;
        let resourceGlobal = this.getRequiredResource(this.resource.name)
        if (resourceGlobal.amount < this.maxAmount) {
            ready = true;
        }
        return ready
    }
    display() {
        const container = document.getElementById('beg-list') as HTMLDivElement;
        let button = document.getElementById('beg' + this.name) as HTMLButtonElement;

        if (!button) {
            button = document.createElement('button');
            button.id = "beg" + this.name;
            button.className = "beg"
            let resourceText = "";
            switch (this.resource.name) {
                case 'coins':
                    resourceText = `Beg for ${this.amount} ${this.resource}`
                    break;
                default:
                    resourceText = `Scavange for ${this.amount} ${this.resource}`
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


let fakeBegs: number = 0;
let fakeBegButton: HTMLButtonElement = document.createElement('button');
function createFakeBegButton() {
    //create a button that give a certain gear piece
    const container = document.getElementById('beg-list') as HTMLDivElement;
    //create a button
    fakeBegButton.id = "begFake";
    fakeBegButton.className = "beg"
    fakeBegButton.innerHTML = "Salvange Gear";
    container.appendChild(fakeBegButton);

    fakeBegButton.onclick = () => {
        unlockStarterGear()

    }

}
function unlockStarterGear() {
    // Call upgrade function with the name of the upgrade
    let gearCreation: boolean = false;
    let baseType: BaseType | null;
    switch (fakeBegs) {
        case 0:
            baseType = findBaseTypeByNameandGearType("Scrap", 'Spade')
            if (baseType) {
                gearCreation = createGear("Weapon", "Spade", baseType, 'Starter');
                if (gearCreation) {
                    game.unlockedSpade = true;
                    fakeBegs++;
                }
                break;
            }

        case 1:
            baseType = findBaseTypeByNameandGearType("Scrap", 'Axe')
            if (baseType) {
                gearCreation = createGear("Weapon", "Axe", baseType, 'Starter');
                if (gearCreation) {
                    game.unlockedAxe = true;
                    setResourceActive('wood');
                    fakeBegs++;
                }
                break;
            }
        case 2:
            baseType = findBaseTypeByNameandGearType("Scrap", 'Hammer')
            if (baseType) {
                gearCreation = createGear("Weapon", "Hammer", baseType, 'Starter');
                if (gearCreation) {
                    game.unlockedHammer = true;
                    unlockMaterials()
                    unlockCrafting()
                    fakeBegs++;

                    game.unlockedPickaxe = true;
                    setResourceActive('stone');
                    setResourceActive('copper');
                    setResourceActive('silver');
                    setResourceActive('gold');
                }
                break;
            }
        default:
            console.log(`error in fakeBegs switch statement, fakeBegs: ${fakeBegs}`);
            break;
    }
    showFakeBegButton();
}
function showFakeBegButton() {
    if (game.workerCountMax > fakeBegs && !game.unlockedHammer) {
        fakeBegButton.style.display = "block";
    }
    else {
        fakeBegButton.style.display = "none";
    }
} */