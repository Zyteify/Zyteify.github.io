"use strict";
//set the crafting div inititialisation
//set the item options
let craftingItemOptions = document.createElement('p');
craftingItemOptions.id = "crafting-item-options";
craftingItemOptions.innerHTML = "Item Options";
craftingItemStatsDiv.appendChild(craftingItemOptions);
//set the item materials
let craftingItemMaterials = document.createElement('p');
craftingItemMaterials.id = "crafting-item-materials";
craftingItemMaterials.innerHTML = "Item Materials";
craftingItemStatsDiv.appendChild(craftingItemMaterials);
function createRandomGear() {
    let randomGearType = gearTypes[Math.floor(Math.random() * gearTypes.length)];
    let randomItemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    //set it to weapon for now while we only have weapons
    randomItemType = "Weapon";
    //create a new worker
    let gearCreation = createGear(randomItemType, randomGearType);
    if (gearCreation) {
        craftResource -= craftingCost;
        updateCraftingButton();
    }
    return gearCreation;
}
function createGear(itemType, GearType, baseType, rarity) {
    if (game.gearCountCurrent < game.gearCountMax) {
        //type: ItemType, gear?: GearType,baseType?: string, rarity?: rarityType
        let newGear = new Item(itemType, GearType, baseType, rarity);
        items.push(newGear);
        game.gearCountCurrent++;
        displayText();
        if (newGear.gear == "Pickaxe") {
            game.unlockedPickaxe = true;
            setResourceActive(ResourceType.stone);
            setResourceActive(ResourceType.gems);
            setResourceActive(ResourceType.metal);
        }
        return true;
    }
    else {
        console.log(`failed to create gear, gear count current: ${game.gearCountCurrent}, gear count max: ${game.gearCountMax}`);
        return false;
    }
}
function updateCraftingButton() {
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
