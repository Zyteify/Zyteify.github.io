let craftingButtonsList: CraftingButton[] = []
class CraftingButton {
    id: number = 0;
    baseType: BaseType;
    active: any = {
        gearSlot: false,
        gearType: false,
        baseTypeName: false
    };
    div: HTMLDivElement;
    button: HTMLButtonElement;
    picture: HTMLImageElement;
    costDiv: HTMLDivElement;
    setup: boolean = false;
    flashed: boolean = false;
    resources: Resource[] = [];
    static count: number = 0;


    constructor(baseType: BaseType) {
        this.id = CraftingButton.count++;
        this.baseType = baseType;



        this.div = document.createElement('div');
        this.div.id = `crafting-div-${this.id}`;
        this.div.className = "crafting-div";

        craftingChooseDiv.appendChild(this.div);

        this.button = document.createElement('button');
        this.button.id = `crafting-button-${this.id}`;
        this.button.className = "crafting-button";
        this.button.onclick = function () {

        }

        this.picture = document.createElement('img');
        this.picture.id = `crafting-picture-${this.id}`;
        this.picture.className = "crafting-picture";
        this.picture.src = `./dist/img/${this.baseType.gearType.toLocaleLowerCase()}.png`;

        this.costDiv = document.createElement('div');
        this.costDiv.id = `crafting-cost-div-${this.id}`;
        this.costDiv.className = "crafting-cost-div";

        //add a resource from all the resources in the baseType. the container will be the costDiv
        for (let i = 0; i < this.baseType.resource.length; i++) {
            let resource = new Resource(this.baseType.resource[i].ResourceType, this.baseType.resource[i].amount, this.costDiv)
            this.resources.push(resource);
        }

        this.button.appendChild(this.picture);
        this.button.appendChild(this.costDiv);
        this.div.appendChild(this.button);
        this.display()
    }

    canCraft() {
        let craftWorkAvailable = false;
        craftWorkAvailable = this.baseType.craftingCost > craftWork
        let craftingResourcesAvailable = false;
        if (this.resources.length > 0) {
            for (let i = 0; i < this.resources.length; i++) {
                //get the resource from the global list of resources
                //resource from basetypes are in two different arrays; resource and resourceCost
                let resource = getResourceByName(this.resources[i].ResourceType);
                if (resource) {
                    if (this.resources[i].amount > resource.amount) {
                        craftingResourcesAvailable = true;
                    }
                }
            }
        }
        else {
            craftingResourcesAvailable = true;
        }
        return craftWorkAvailable && craftingResourcesAvailable;
    }

    isActive() {
        return this.active.gearSlot && this.active.gearType && this.active.baseTypeName;
    }

    isDisabled() {
        if(this.active.gearSlot && this.active.baseTypeName){
            if(!this.active.gearType){
                return true
            }
        }
        return false
    }

    //set the button to inactive or not and also hide it if it is not active
    display() {
        if (!this.isActive()) {
            this.div.classList.add("hide");
        }
        else {
            this.div.classList.remove("hide");
            if(!this.flashed){
                this.flashed = true;
                flashElement(this.div)
            }
        }
        if (!this.canCraft() || this.isDisabled()) {
            this.button.classList.add("inactive");
        }
        else {
            this.button.classList.remove("inactive");
        }

        //if the costDiv has no children, add them
        if (!this.setup) {
            this.addCostDivChildren();
        }
    }

    addCostDivChildren() {
        this.setup = true;
        //update the paragraph
        let initialParagraph = document.createElement('p');
        initialParagraph.id = `crafting-paragraph-${this.id}`;
        initialParagraph.className = `crafting-paragraph-initial`;
        initialParagraph.innerHTML = `${this.baseType.name}-${this.baseType.gearType}`;
        this.costDiv.appendChild(initialParagraph);
        if (this.resources.length > 0) {
            for (let i = 0; i < this.resources.length; i++) {

                /* this.resources[i].container = this.costDiv; */
                //actually set the display to be here
                this.resources[i].active = true;
                //remove the resource from the costDiv and add it back in
                this.resources[i].container.removeChild(this.resources[i].div);
                this.costDiv.appendChild(this.resources[i].div);


                this.resources[i].display();
            }
        }
    }


    setActive(type: string, name: string) {
        switch (type) {
            case "gearSlot":
                if (this.baseType.gearSlot == name) {
                    this.active.gearSlot = true;
                }
                break;
            case "gearType":
                if (this.baseType.gearType == name) {
                    this.active.gearType = true;
                }
                break;
            case "baseTypeName":
                if (this.baseType.name == name) {
                    this.active.baseTypeName = true;
                }
                break;
            default:
                console.log(`error unlocking crafting button ${name} ${type}`);
                break;
        }
    }
}

//create a button for each option of item to create in baseTypeList
function createCraftingButtons() {
    for (let i = 0; i < baseTypes.length; i++) {
        //create a craftingButton
        let craftingButton = new CraftingButton(baseTypes[i]);
        craftingButtonsList.push(craftingButton)
    }
    unlockCraftingButtonType("Weapon", "gearSlot")
}

function unlockCraftingButtonType(name: string, type: string) {
    for (let i = 0; i < craftingButtonsList.length; i++) {
        craftingButtonsList[i].setActive(type, name);
    }
}

function updateCraftButton() {
    for (let i = 0; i < craftingButtonsList.length; i++) {
        craftingButtonsList[i].display();
    }
}

function initializeCrafting() {
    createCraftingButtons()
    /* initializeGearSlotDropdown()
    initializeBaseTypeNameDropdown()
    initializeGearTypeDropdown()
    initializeCraftButton() */

}

/* function initializeCraftButton() {
    //create-gear
    materialsCreateGearButton.disabled = true;

    //if the craft button is clicked, craft the item
    materialsCreateGearButton.onclick = function () {
        unlockCrafting()
        createSelectedGear();
    }

}

function initializeBaseTypeNameDropdown() {
    //create a dropdown menu for the crafting items
    materialsItemDropdown.id = "crafting-item-basetypename-dropdown";
    materialsItemDropdown.className = "crafting-item-basetypename--dropdown"

    //add an event listener to the dropdown menu
    materialsItemDropdown.addEventListener('change', handleSelectChange);

    //remove existing options
    while (materialsItemDropdown.firstChild) {
        materialsItemDropdown.removeChild(materialsItemDropdown.firstChild);
    }

    //create a list of options for the dropdown menu
    const options: HTMLOptionElement[] = []

    // create a Set to store unique option values
    const uniqueValues = new Set<string>();

    // add every item to the dropdown menu
    for (let i = 0; i < baseTypeList.length; i++) {
        const value = baseTypeList[i].name;

        // check if the value is already in the Set
        if (!uniqueValues.has(value)) {
            let option: HTMLOptionElement = document.createElement('option');
            option.value = value;
            option.text = value;
            options.push(option);

            // add the value to the Set to mark it as seen
            uniqueValues.add(value);
        }
    }

    //add the options to the dropdown menu
    for (let i = 0; i < options.length; i++) {
        materialsItemDropdown.appendChild(options[i]);
    }
}

function initializeGearTypeDropdown() {
    //create a dropdown menu for the crafting items
    materialsGearDropdown.id = "crafting-item-geartype-dropdown";
    materialsGearDropdown.className = "crafting-item-geartype-dropdown"

    //add an event listener to the dropdown menu
    materialsGearDropdown.addEventListener('change', handleSelectChange);

    //remove existing options
    while (materialsGearDropdown.firstChild) {
        materialsGearDropdown.removeChild(materialsGearDropdown.firstChild);
    }

    //create a list of options for the dropdown menu
    const options: HTMLOptionElement[] = []

    // create a Set to store unique option values
    const uniqueValues = new Set<string>();

    // add every item to the dropdown menu
    for (let i = 0; i < baseTypeList.length; i++) {
        const value = baseTypeList[i].gearType;

        // check if the value is already in the Set
        if (!uniqueValues.has(value)) {
            let option: HTMLOptionElement = document.createElement('option');
            option.value = value;
            option.text = value;
            options.push(option);

            // add the value to the Set to mark it as seen
            uniqueValues.add(value);
        }
    }

    //add the options to the dropdown menu
    for (let i = 0; i < options.length; i++) {
        materialsGearDropdown.appendChild(options[i]);
    }
}

function initializeGearSlotDropdown() {
    //create a dropdown menu for the crafting items
    materialsGearSlotDropdown.id = "crafting-item-gearslot-dropdown";
    materialsGearSlotDropdown.className = "crafting-item-gearslot-dropdown"

    //add an event listener to the dropdown menu
    materialsGearSlotDropdown.addEventListener('change', handleSelectChange);

    //remove existing options
    while (materialsGearSlotDropdown.firstChild) {
        materialsGearSlotDropdown.removeChild(materialsGearSlotDropdown.firstChild);
    }

    //create a list of options for the dropdown menu
    const options: HTMLOptionElement[] = []

    // create a Set to store unique option values
    const uniqueValues = new Set<string>();

    // add every item to the dropdown menu
    for (let i = 0; i < baseTypeList.length; i++) {
        const value = baseTypeList[i].gearSlot;

        // check if the value is already in the Set
        if (!uniqueValues.has(value)) {
            let option: HTMLOptionElement = document.createElement('option');
            option.value = value;
            option.text = value;
            options.push(option);

            // add the value to the Set to mark it as seen
            uniqueValues.add(value);
        }
    }

    //add the options to the dropdown menu
    for (let i = 0; i < options.length; i++) {
        materialsGearSlotDropdown.appendChild(options[i]);
    }
}

 */
