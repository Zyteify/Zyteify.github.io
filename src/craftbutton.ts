let craftingButtonsList: CraftingButton[] = []
class CraftingButton {
    id: number = 0;
    baseType: BaseType;
    active: any = {
        gearSlot: false,
        gearType: false,
        baseTypeName: false
    };
    selectable: any = {
        gearSlot: false,
        gearType: false,
        baseTypeName: false
    };
    div: HTMLDivElement;
    button: HTMLButtonElement;
    picture: HTMLImageElement;
    costDiv: HTMLDivElement;
    setup: boolean = false;
    flashedActive: boolean = false;
    flashedReady: boolean = false;
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
            let gearCreation = createGear(true, baseType, 'Common', itemsCrafting);
            if (gearCreation) {
                /* craftWork -= craftingCosts.craftingWork;
                updateCraftButton(); */
                controlCraftingButtons()
            }
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
        craftWorkAvailable = this.baseType.craftingCost <= craftWork
        let craftingResourcesAvailable = false;
        if (this.resources.length > 0) {
            let craftingResourcesAvailabletemp = true;
            for (let i = 0; i < this.resources.length; i++) {
                //get the resource from the global list of resources
                //resource from basetypes are in two different arrays; resource and resourceCost
                let resource = getResourceByName(this.resources[i].ResourceType);
                if (resource) {
                    if (!(this.resources[i].amount <= resource.amount)) {
                        //if any resource is not available, craftingResourcesAvailable is false
                        craftingResourcesAvailabletemp = false;
                        
                    }
                }
            }
            craftingResourcesAvailable = craftingResourcesAvailabletemp;
        }
        else {
            craftingResourcesAvailable = true;
        }
        return craftWorkAvailable && craftingResourcesAvailable;
    }

    isActive() {
        return this.active.gearSlot && this.active.gearType && this.active.baseTypeName;
    }

    isSelectable() {
        return this.selectable.gearSlot && this.selectable.gearType && this.selectable.baseTypeName;
    }

    //set the button to inactive or not and also hide it if it is not active
    display() {
        if (!this.isActive()) {
            this.div.classList.add("hide");
        }
        else {
            this.div.classList.remove("hide");
            if (!this.flashedActive) {
                this.flashedActive = true;
                flashElementBad(this.div)
            }

        }
        if (!this.canCraft()) {
            this.button.disabled = true;
        }
        else {
            this.button.disabled = false;
        }
        if (!this.isSelectable()) {
            this.button.classList.add("not-selectable");
        }
        else {
            this.button.classList.remove("not-selectable");

        }
        //if it is all ready, flash the button one time
        if (!this.flashedReady && this.isSelectable() && this.isActive() && this.canCraft()) {
            this.flashedReady = true;
            flashElementGood(this.div)
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
        initialParagraph.innerHTML = `${this.baseType.baseMaterial}-${this.baseType.gearType}`;
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
        if (this.baseType.craftingCost > 0) {
            //create a paragraph for the crafting cost
            let craftingCostParagraph = document.createElement('p');
            craftingCostParagraph.id = `crafting-cost-paragraph-${this.id}`;
            craftingCostParagraph.className = `crafting-cost-paragraph`;
            craftingCostParagraph.innerHTML = `🔨 ${this.baseType.craftingCost.toString()}`;
            this.costDiv.appendChild(craftingCostParagraph);
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
                if (this.baseType.baseMaterial == name) {
                    this.active.baseTypeName = true;
                }
                break;
            default:
                console.log(`error unlocking crafting button ${name} ${type}`);
                break;
        }
    }

    setSelectable(type: string, name: string) {
        switch (type) {
            case "gearSlot":
                if (this.baseType.gearSlot == name) {
                    this.selectable.gearSlot = true;
                }
                break;
            case "gearType":
                if (this.baseType.gearType == name) {
                    this.selectable.gearType = true;
                }
                break;
            case "baseTypeName":
                if (this.baseType.baseMaterial == name) {
                    this.selectable.baseTypeName = true;
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
    unlockCraftingButtonTypeActive("Weapon", "gearSlot")
    unlockCraftingButtonTypeSelectable("Weapon", "gearSlot")
}

function unlockCraftingButtonTypeActive(name: string, type: string) {
    for (let i = 0; i < craftingButtonsList.length; i++) {
        craftingButtonsList[i].setActive(type, name);
    }
}

function unlockCraftingButtonTypeSelectable(name: string, type: string) {
    for (let i = 0; i < craftingButtonsList.length; i++) {
        craftingButtonsList[i].setSelectable(type, name);
    }
}

//set all the weapon geartypes to be active
function unlockCraftingButtonTypeActiveAllWeapons() {
    for (let i = 0; i < craftingButtonsList.length; i++) {
        if (craftingButtonsList[i].baseType.gearSlot == "Weapon") {
            craftingButtonsList[i].active.gearType = true;
        }
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
