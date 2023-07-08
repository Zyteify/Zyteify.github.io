
function updateCraftButton() {

    let text = ''
    for (const [key, value] of Object.entries(craftingCosts.craftingResources)) {
        //get the icon from the resource
        const resource = getResourceByName(value.type);
        if (resource) {
            text += ` ${resource.icon} ${value.amount}`
        }
    }
    materialsCreateGearButton.innerHTML = `Craft Gear (🔨${craftingCosts.craftingWork}${text})`;

    const resourcesAvailable = Object.values(craftingCosts.craftingResources).every((resource) => {
        const resourceGlobal = getResourceByName(resource.type);
        if (resourceGlobal) {
            return resourceGlobal.amount >= resource.amount;
        }
        return false;
    });
    //if the player has enough resources, enable the button
    if (craftWork >= craftingCosts.craftingWork && resourcesAvailable) {
        materialsCreateGearButton.disabled = false;
    }
    else {
        materialsCreateGearButton.disabled = true;
    }


    //if the crafting button has not been shown yet, show it
    if (!game.unlockedCraftingButton) {
        game.unlockedCraftingButton = true;
        materialsResource.style.display = "block"
        materialsCreateGearButton.style.display = "block"
    }
}

interface CraftingCosts {
    craftingWork: number;
    craftingResources: {
        [key: string]: {
            type: ResourceType;
            amount: number;
        };
    };
}
const craftingCosts: CraftingCosts = {
    craftingWork: 5,
    craftingResources: {},
};

function getCraftingCosts() {
    //get the crafting costs from the selected base type and gear type
    const baseTypeName = <BaseTypeName>materialsItemDropdown.value;
    const gearType = <GearType>materialsGearDropdown.value;

    //remove existing craftingcosts/resources
    craftingCosts.craftingResources = {};
    craftingCosts.craftingWork = 123456789;

    const baseType = findBaseTypeByNameandGearType(baseTypeName, gearType);
    if (baseType) {
        craftingCosts.craftingWork = baseType.craftingCost;
        craftingCosts.craftingResources = {};
        for (let i = 0; i < baseType.resource.length; i++) {
            craftingCosts.craftingResources[baseType.resource[i]] = {
                type: baseType.resource[i],
                amount: baseType.resourceCost[i],
            };
        }
    }

    updateCraftButton();
}

function initializeCrafting() {

    initializeBaseTypeNameDropdown()
    initializeGearTypeDropdown()
    initializeCraftButton()
    getCraftingCosts();

}

function initializeCraftButton() {
    //create-gear
    materialsCreateGearButton.disabled = true;
    

    //if the craft button is clicked, craft the item
    materialsCreateGearButton.onclick = function () {
        unlockCrafting()
        createSelectedGear();
    }

}

function handleSelectChange() {
    getCraftingCosts();
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


