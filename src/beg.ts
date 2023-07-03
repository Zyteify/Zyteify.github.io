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
    beg() {
        if (resources[this.resource.name].amount < this.maxAmount) {
            resources[this.resource.name].amount += this.amount;
        }
    }
    isAvailable() {
        let ready = false;
        if (resources[this.resource.name].amount < this.maxAmount) {
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