

//create an item div
const item = document.createElement('div');
//set the item div class
item.classList.add("item");




//create an item name div
const itemNameDiv = document.createElement('div');
//set the item name div class
itemNameDiv.classList.add("item-nameDiv");
//create an item picture div
const itemPictureDiv = document.createElement('div');
//set the item picture div class
itemPictureDiv.classList.add("item-pictureDiv");
//create an item gear div
const itemGearDiv = document.createElement('div');
//set the item gear div class
itemGearDiv.classList.add("item-gearDiv");
//create an item stats div
const itemStatsDiv = document.createElement('div');
//set the item stats div class
itemStatsDiv.classList.add("item-statsDiv");
//create an item rarity div
const itemRarityDiv = document.createElement('div');
//set the item rarity div class
itemRarityDiv.classList.add("item-rarityDiv");

//append the divs to the item div
item.appendChild(itemNameDiv);
item.appendChild(itemPictureDiv);
item.appendChild(itemRarityDiv);
item.appendChild(itemGearDiv);
item.appendChild(itemStatsDiv);



let craftingItemName = document.createElement('p');
craftingItemName.classList.add("item-name");
craftingItemName.innerHTML = "Item Name";
itemNameDiv.appendChild(craftingItemName);

//set the item picture
let craftingItemPicture = document.createElement('img');
craftingItemPicture.classList.add("item-picture");
craftingItemPicture.src = "../dist/img/sword.png";
itemPictureDiv.appendChild(craftingItemPicture);

//set the item rarity
let craftingItemRarity = document.createElement('p');
craftingItemRarity.classList.add("item-rarity");
craftingItemRarity.classList.add("small-margin");
craftingItemRarity.innerHTML = "magic";
itemRarityDiv.appendChild(craftingItemRarity);

//set the item gear
let craftingItemGear = document.createElement('p');
craftingItemGear.classList.add("item-gear");
craftingItemGear.classList.add("small-margin");
craftingItemGear.innerHTML = "Sword";
itemGearDiv.appendChild(craftingItemGear);

let craftingItemStat = [];
let craftingItemStatDiv = [];
let craftingItemStatAffix = [];

//item stat div
let stat1Div = document.createElement('div');
stat1Div.classList.add("item-statDiv");
stat1Div.classList.add("small-margin");
craftingItemStatDiv.push(stat1Div);

let stat2Div = document.createElement('div');
stat2Div.classList.add("item-statDiv");
stat2Div.classList.add("small-margin");
craftingItemStatDiv.push(stat2Div);

//set the item stats
let stat1 = document.createElement('p');
stat1.classList.add("item-stat");
stat1.classList.add("small-margin");
stat1.innerHTML = "+100 to attack";
stat1.dataset.stat = "attack";
stat1.dataset.affix = "prefix";
craftingItemStat.push(stat1);

//set the item stats
let statafffix1 = document.createElement('p');
statafffix1.classList.add("item-stat-affix");
statafffix1.innerHTML = "(P1)";
statafffix1.classList.add("small-margin");
craftingItemStatAffix.push(statafffix1);

let stat2 = document.createElement('p');
stat2.classList.add("item-stat");
stat2.classList.add("small-margin");
stat2.innerHTML = "+100 to Defenceaaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaaaaaa aaaaaaaaaaaa";
stat2.dataset.stat = "defense";
stat2.dataset.affix = "suffix";
craftingItemStat.push(stat2);

//set the item stats
let statafffix2 = document.createElement('p');
statafffix2.classList.add("item-stat-affix");
statafffix2.innerHTML = "(S1)";
statafffix2.classList.add("small-margin");
craftingItemStatAffix.push(statafffix2);

for (let i = 0; i < craftingItemStat.length; i++) {
    craftingItemStatDiv[i].appendChild(craftingItemStatAffix[i]);
    craftingItemStatDiv[i].appendChild(craftingItemStat[i]);
    
}

for (let i = 0; i < craftingItemStatDiv.length; i++) {
    itemStatsDiv.appendChild(craftingItemStatDiv[i]);
}







//crafting
const craftingDiv = document.getElementById('crafting');
const craftingItemDiv = document.getElementById('crafting-item');

//append the item div to the crafting div
craftingItemDiv.appendChild(item);

const craftingOptions = document.getElementById('crafting-optionsDiv');
const craftingMaterialsList = document.getElementById('crafting-materials-listDiv');

//set the item options
let craftingItemOptions = document.createElement('p');
craftingItemOptions.classList.add("item-options");
craftingItemOptions.innerHTML = "Item Options";
craftingDiv.appendChild(craftingItemOptions);

//set the item materials
let craftingItemMaterials = document.createElement('p');
craftingItemMaterials.classList.add("item-materials");
craftingItemMaterials.innerHTML = "Item Materials";
craftingDiv.appendChild(craftingItemMaterials);