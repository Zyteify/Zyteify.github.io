class Beg {
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
                case ResourceType.coins:
                    resourceText = `Beg for ${this.amount} ${this.resource.icon}`
                    break;
                default:
                    resourceText = `Scavange for ${this.amount} ${this.resource.icon}`
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
    switch (fakeBegs) {
        case 0:
            gearCreation = createGear("Weapon", "Hoe", 'Wooden', 'Starter');
            if (gearCreation) {
                game.unlockedHoe = true;
                fakeBegs++;
            }


            break;
        case 1:
            gearCreation = createGear("Weapon", "Axe", 'Wooden', 'Starter');
            if (gearCreation) {
                game.unlockedAxe = true;
                setResourceActive(ResourceType.wood);
                fakeBegs++;
            }
            break;
        case 2:
            gearCreation = createGear("Weapon", "Hammer", 'Wooden', 'Starter');
            if (gearCreation) {
                game.unlockedHammer = true;
                unlockMaterials()
                fakeBegs++;
            }
            break;
        default:
            console.log(`error in fakeBegs switch statement, fakeBegs: ${fakeBegs}`);
            break;
    }
    showFakeBegButton();
}
function showFakeBegButton() {
    if (game.gearCountMax > fakeBegs && !game.unlockedHammer) {
        fakeBegButton.style.display = "block";
    }
    else {
        fakeBegButton.style.display = "none";
    }
}