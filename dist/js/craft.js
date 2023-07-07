"use strict";
//set the crafting div inititialisation
//set the item options
let craftingItemOptions = document.createElement('p');
craftingItemOptions.id = "crafting-item-options";
craftingItemOptions.innerHTML = "Item Options";
craftingOptionsDiv.appendChild(craftingItemOptions);
//set the item materials
let craftingItemMaterials = document.createElement('p');
craftingItemMaterials.id = "crafting-item-materials";
craftingItemMaterials.innerHTML = "Item Materials";
craftingMaterialsListDiv.appendChild(craftingItemMaterials);
function createRandomGear() {
    let randomGearType = gearTypes[Math.floor(Math.random() * gearTypes.length)];
    let randomItemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    //set it to weapon for now while we only have weapons
    randomItemType = "Weapon";
    //create a new worker
    let gearCreation = createGear(randomItemType, randomGearType);
    if (gearCreation) {
        craftResource -= craftingCost;
        updateCraftButton();
        controlCraftingButtons();
    }
    return gearCreation;
}
function createGear(itemType, GearType, baseType, rarity) {
    let location;
    let locationDiv;
    //starter gear goes directly into inventory
    if (rarity == 'Starter') {
        location = items;
        locationDiv = gearListContainer;
    }
    else {
        location = craftingItems;
        locationDiv = craftingItemSectionDiv;
    }
    //get the div for the location
    //if the location to put the new item is items and the player has room for it, create the item
    if ((location == items && roomAvailable(craftingItems))
        || (location == craftingItems && craftingItems.length < craftingItemsMax)) {
        let newGear = new Item(itemType, GearType, baseType, rarity);
        newGear.setParentDiv(locationDiv);
        location.push(newGear);
        displayText();
        if (newGear.gear == "Pickaxe") {
            game.unlockedPickaxe = true;
            setResourceActive(ResourceType.stone);
            setResourceActive(ResourceType.gems);
            setResourceActive(ResourceType.metal);
        }
        controlCraftingButtons();
        return true;
    }
    else {
        if (location == items) {
            console.log(`failed to create gear, gear count current: ${items.length}, gear count max: ${game.gearCountMax}`);
        }
        else {
            console.log(`failed to create gear, crafting items current: ${craftingItems.length}, crafting items max: ${craftingItemsMax}`);
        }
        return false;
    }
}
function updateCraftButton() {
    //if the player has enough resources, enable the button
    if (craftResource >= craftingCost) {
        unlockCrafting();
        createGearButton.disabled = false;
    }
    else {
        createGearButton.disabled = true;
    }
    //if the crafting button has not been shown yet, show it
    if (!game.unlockedCraftingButton) {
        game.unlockedCraftingButton = true;
        craftingResource.style.display = "block";
        createGearButton.style.display = "block";
    }
}
let craftingCost = 5;
//create-gear
const createGearButton = document.getElementById('create-gear');
createGearButton.disabled = true;
createGearButton.innerHTML = `Craft Gear (🔨${craftingCost})`;
//if the craft button is clicked, craft the item
createGearButton.onclick = function () {
    unlockCrafting();
    createRandomGear();
};
//add a button in the item options to delete the item
let deleteButton = document.createElement('button');
deleteButton.innerHTML = "Delete";
deleteButton.onclick = function () {
    deleteItem();
};
craftingOptionsDiv.appendChild(deleteButton);
//add a button in the item options to add the item to gear
let addToGearButton = document.createElement('button');
addToGearButton.innerHTML = "Add to Gear";
addToGearButton.onclick = function () {
    addToGear();
};
craftingOptionsDiv.appendChild(addToGearButton);
//todo add and remove event listeners for the crafting items list
function deleteItem() {
    //get the item from the crafting items list
    let item = craftingItems[0];
    //remove the item from the crafting items list
    craftingItems.splice(0, 1);
    //remove the itemDiv from the crafting item section
    craftingItemSectionDiv.removeChild(item.div);
    //update the crafting button
    updateCraftButton();
    controlCraftingButtons();
}
function addToGear() {
    if (roomAvailable(items)) {
        //get the item from the crafting items list
        let item = craftingItems[0];
        //remove the item from the crafting items list
        craftingItems.splice(0, 1);
        //set the parent div to the gear list
        item.setParentDiv(gearListContainer);
        item.resetDiv();
        //add the item to the items list
        items.push(item);
        //update the crafting button
        updateCraftButton();
        controlCraftingButtons();
    }
    else {
        console.log(`failed to add to gear, gear count current: ${items.length}, gear count max: ${game.gearCountMax}`);
    }
}
function controlCraftingButtons() {
    if (craftingItems.length > 0) {
        deleteButton.disabled = false;
        addToGearButton.disabled = false;
    }
    if (craftingItems.length == 0) {
        deleteButton.disabled = true;
        addToGearButton.disabled = true;
    }
    if (!roomAvailable(items)) {
        addToGearButton.disabled = true;
    }
}
