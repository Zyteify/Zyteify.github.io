/* 
class Tool {
    id: number;
    name: BaseMaterial;
    gearType: GearType;
    resource: Resource[] = [];
    active: boolean = false

    //display
    resourceSpan: HTMLElement;
    button: HTMLButtonElement;
    flashed: boolean = false;
    constructor(baseType: BaseType) {
        this.id = baseType.id;
        this.name = baseType.baseMaterial
        this.gearType = baseType.gearType

        this.button = document.createElement('button');
        this.resourceSpan = document.createElement('span');
        this.resourceSpan.id = `tool-resource-span-${this.name}`;
        this.resourceSpan.className = 'tool-span-resource';
    }

    export() {
        let tool = {
            id: this.id,
            name: this.name,
            gearType: this.gearType,
            resource: this.resource,
        }
        return tool
    }

    display() {
        if (this.button.id == "") {
            this.button = document.createElement('button');
            this.button.id = 'tool' + this.name;
            this.button.className = 'tool';

            //create a span element for the button
            const span = document.createElement('span');
            span.id = 'tool' + this.name + 'span';
            span.className = 'tool-span';
            this.button.appendChild(span);

            // Set the button text to the tool name, resouce required, and cost
            span.textContent = `Upgrade ${this.name} to Wooden`;

            //create a span element for the button
            this.button.appendChild(this.resourceSpan);

            //create a div element for the button inside the span
            const div = document.createElement('div');
            div.id = 'tool-span-resource' + this.name + 'div';
            div.className = 'tool-span-resource-div';
            this.resourceSpan.appendChild(div);

            toolButtonList.appendChild(this.button);

            this.button.onclick = () => {
                this.click()
            };
        }

        //loop through the resources required for the tool and display them
        for (let i = 0; i < this.resource.length; i++) {
            this.resource[i].display()
        }

        //if the tool is not available, make the button disabled
        if (!this.isAvailable()) {
            this.button.disabled = true;
            this.flashed = false;
            this.button.classList.remove('flash-border-good');
        }
        else {
            this.button.disabled = false;
            if (!this.flashed) {
                this.flashed = true;
                flashElementGood(this.button)
            }
        }

        //if the tool is unavailable, hide the button
        if (this.active == false) {
            this.button.style.display = "none";
        }

    }

    click() {

        //set the basetype to active and tool all instances of it on workers
        let baseType = <BaseType>fundBaseTypeById(this.id)
        baseType.unlocked = true;
        upgradeExistingItem(baseType);
        this.active = false;
    }

    isAvailable(): boolean {
        let ready = false;
        let resourcesAvailable = false;
        if (this.active == true) {
            ready = true;
        }
        //check to see if the player has enough resources
        resourcesAvailable = this.resourceAvailable()

        let result = ready && resourcesAvailable;
        return result;
    }

    resourceAvailable(): boolean {
        let result = true;
        for (let i = 0; i < this.resource.length; i++) {
            let resourceAvailable = false
            for (let j = 0; j < resources.length; j++) {
                if (this.resource[i].ResourceType == resources[j].ResourceType && this.resource[i].amount <= resources[j].amount) {
                    resourceAvailable = true;
                }
            }
            if (!resourceAvailable) {
                result = false
            }
        }
        return result;
    }
}

function unlockTool(name: BaseMaterial) {
    //loop through each tool and set it to active if it matches the name
    for (let i = 0; i < tools.length; i++) {
        if (tools[i].name == name) {
            tools[i].active = true;
            tools[i].display()
        }
    }
}

//loop through all items in workers and upgrade them
function upgradeExistingItem(baseType: BaseType) {
    for (let i = 0; i < workers.length; i++) {
        for (let j = 0; j < workers[i].weapon.length; j++) {
            if (workers[i].weapon[j].baseType == baseType) {
                // workers[i].weapon[j].upgrade()
            }
        }
    }

}
 */