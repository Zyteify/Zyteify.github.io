"use strict";
class Item {
    id;
    type;
    image;
    //mods
    baseType;
    prefixes = [];
    suffixes = [];
    rarity;
    itemMods = [];
    mods = {
        itemPower: 0,
        itemPowerLocalAddition: 0,
        itemPowerLocalMultiplier: 0,
        duplicateWork: 0,
        adjacentWorkPower: 0,
        chanceToRepeatGreatestWork: 0,
        otherModTiers: 0,
        criticalWorkChance: 0,
        criticalWorkMultiplier: 0,
        chanceToNotConsumeEnergy: 0,
        multiplyStock: 0,
    };
    //display
    div;
    hoverDiv;
    hoverInsideDiv;
    container;
    containerNumber;
    imageDiv;
    imageBG;
    setup = false;
    setupHover = false;
    static count = 0;
    constructor(type, baseType, rarity, full) {
        this.id = Item.count++;
        this.type = type;
        this.baseType = baseType;
        this.rarity = rarity;
        if (full) {
            this.prefixes = full.prefixes;
            this.suffixes = full.suffixes;
        }
        else {
            //generate the affixes
            let affixes = generateAffixes(this.rarity, this.baseType.gearType);
            for (let i = 0; i < affixes.length; i++) {
                if (affixes[i].affix == "Prefix") {
                    this.prefixes.push(affixes[i]);
                }
                else if (affixes[i].affix == "Suffix") {
                    this.suffixes.push(affixes[i]);
                }
            }
        }
        this.populateItemMods();
        this.calculateModStrength();
        this.image = new Image();
        //create an item div
        this.div = document.createElement('div');
        //set the item div class
        this.div.id = "gear-div" + this.id.toString();
        this.div.className = "gear-div";
        this.div.draggable = true;
        this.div.classList.add("item");
        //create a hover div
        this.hoverDiv = document.createElement('div');
        this.hoverDiv.id = "hover" + this.id.toString();
        this.hoverDiv.className = "hover";
        this.hoverDiv.style.display = 'none';
        this.hoverInsideDiv = document.createElement('div');
        this.hoverInsideDiv.draggable = false;
        this.hoverInsideDiv.classList.add("item");
        this.hoverInsideDiv.classList.add("item-background");
        //create an item picture div
        this.imageDiv = document.createElement('div');
        //set the item picture div class
        this.imageDiv.classList.add("item-pictureDiv");
        this.imageBG = new Image();
        //by default make the parent container the crafting window
        this.container = document.getElementById('crafting-item-section');
        this.containerNumber = -1;
        this.setupDiv();
        this.setParentDiv();
        this.setHoverDiv();
    }
    populateItemMods() {
        //get the list of suffixes and prefixes
        let affixes = this.prefixes.concat(this.suffixes);
        //loop through each and add the item mod to the item
        for (let i = 0; i < affixes.length; i++) {
            this.itemMods.push(affixes[i].itemMod);
        }
        //add the base type item mods
        for (let i = 0; i < this.baseType.itemMod.length; i++) {
            this.itemMods.push(this.baseType.itemMod[i]);
        }
    }
    calculateModStrength() {
        //reset the mods
        this.mods = {
            itemPower: 0,
            itemPowerLocalAddition: 0,
            itemPowerLocalMultiplier: 0,
            duplicateWork: 0,
            adjacentWorkPower: 0,
            chanceToRepeatGreatestWork: 0,
            otherModTiers: 0,
            criticalWorkChance: 0,
            criticalWorkMultiplier: 0,
            chanceToNotConsumeEnergy: 0,
            multiplyStock: 0,
        };
        //loop through each item mod and add the values to the mods
        for (let i = 0; i < this.itemMods.length; i++) {
            let name = this.itemMods[i].modName;
            this.mods[name] += this.itemMods[i].modValue;
        }
    }
    setRarityBorder() {
        switch (this.rarity) {
            case 'Starter':
                this.imageBG.classList.add("item-starter");
                break;
            case 'Common':
                this.imageBG.classList.add("item-common");
                break;
            case 'Magic':
                this.imageBG.classList.add("item-magic");
                break;
            case 'Rare':
                this.imageBG.classList.add("item-rare");
                break;
            case 'Unique':
                this.imageBG.classList.add("item-unique");
                break;
            default:
                console.log(`cannot find rarity ${this.rarity}`);
                break;
        }
    }
    setParentDiv(parent) {
        //remove the div from the current parent
        if (this.div.parentElement != null) {
            this.div.parentElement.removeChild(this.div);
        }
        if (parent == null) {
            parent = gearListContainer;
        }
        this.container = parent;
        this.container.appendChild(this.div);
        this.trackContainer();
        this.setImageSize();
        this.resetDiv();
    }
    setImageSize() {
        //if the item is in the crafting div
        if (this.containerNumber == -1) {
            //add the classlist to the div
            this.imageDiv.classList.add("crafting-item-size-big");
        }
        else {
            this.imageDiv.classList.remove("crafting-item-size-big");
        }
    }
    resetDiv() {
        //destory the div and resetup div
        removeAllChildren(this.div);
        this.setup = false;
        this.setupDiv();
        this.trackContainer();
    }
    trackContainer() {
        //if the item is in the crafting div
        if (this.container == craftingItemSectionDiv) {
            this.containerNumber = -1;
        }
        else if (this.container == gearListContainer) {
            this.containerNumber = -2;
        }
        //otherwise the item is on a worker
        else {
            //get the worker number
            let workerNumber = this.container.id.slice(15, this.container.id.length);
            this.containerNumber = parseInt(workerNumber);
        }
    }
    remove() {
        //remove a resource from its container and list
        this.container.removeChild(this.div);
        this.div.remove();
        let index = -5;
        switch (this.containerNumber) {
            case -1:
                index = itemsCrafting.indexOf(this);
                if (index > -1) {
                    itemsCrafting.splice(index, 1);
                }
                break;
            case -2:
                index = itemsInventory.indexOf(this);
                if (index > -1) {
                    itemsInventory.splice(index, 1);
                }
                break;
            default:
                //convert the container number to a worker number
                let workerNumber = this.containerNumber.toString();
                //get the worker
                let worker = getWorkerById(parseInt(workerNumber));
                //remove the item from the worker
                if (worker) {
                    worker.unequipItem(this);
                }
                break;
        }
        itemsDeleted.push(this);
        //remove event listeners
    }
    handleHover(event) {
        // Position the hoverDiv above the mouse position
        this.hoverDiv.style.display = 'flex';
        const rect = this.div.getBoundingClientRect();
        //how far to set the item to the right. this is the width of the item div divided by 2
        let divWidth = (rect.right - rect.left) / 2;
        let extraHeight = 0;
        //the item label
        const hoverDivRect = this.hoverInsideDiv.getBoundingClientRect();
        let itemLabelHeight = (hoverDivRect.bottom - hoverDivRect.top);
        let itemLabelWidth = (hoverDivRect.right - hoverDivRect.left);
        let top = rect.top - itemLabelHeight - extraHeight;
        if (top < 0) {
            //set the top to instead be the bottom of the item div
            top = rect.bottom - extraHeight;
        }
        let offsetWidth = divWidth - (itemLabelWidth / 2);
        let left = rect.left + offsetWidth;
        if (left < 0) {
            left = 0 + 5;
        }
        else if (left + offsetWidth > window.innerWidth) {
            left = window.innerWidth - itemLabelWidth - 5;
        }
        this.hoverDiv.style.left = left + 'px';
        this.hoverDiv.style.top = top + 'px';
    }
    handleHoverLeave(event) {
        // Perform the desired actions when the item is hovered
        this.hoverDiv.style.display = 'none';
    }
    //there is a div that is used when the item is hovered over
    setHoverDiv() {
        if (!this.setupHover) {
            this.setupHover = true;
            //attach the hoverdiv to the hover-container
            const hoverContainer = document.getElementById('hover-container');
            hoverContainer.appendChild(this.hoverDiv);
            this.hoverDiv.style.zIndex = "1000";
            //attach the hoverinside div to the hover div
            this.hoverDiv.appendChild(this.hoverInsideDiv);
            this.createFullText(this.hoverInsideDiv);
        }
    }
    createFullText(containerDiv) {
        //create an item name div
        const itemNameDiv = document.createElement('div');
        //set the item name div class
        itemNameDiv.classList.add("item-nameDiv");
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
        containerDiv.appendChild(itemNameDiv);
        containerDiv.appendChild(itemRarityDiv);
        containerDiv.appendChild(itemGearDiv);
        containerDiv.appendChild(itemStatsDiv);
        //set the item rarity
        let itemRarity = document.createElement('p');
        itemRarity.classList.add("item-rarity");
        itemRarity.classList.add("small-margin");
        itemRarity.innerHTML = `${this.rarity}`;
        itemRarityDiv.appendChild(itemRarity);
        //set the item gear
        let itemGear = document.createElement('p');
        itemGear.classList.add("item-gear");
        itemGear.classList.add("small-margin");
        itemGear.innerHTML = `${this.baseType.gearType}`;
        itemGearDiv.appendChild(itemGear);
        //set the item gear item power
        let itemPower = document.createElement('p');
        itemPower.classList.add("item-power");
        itemPower.classList.add("small-margin");
        let itemPowerText = "";
        //find the item power mod from the base type
        const foundItemMod = this.baseType.itemMod.find((itemMod) => itemMod.modName === 'itemPower');
        if (foundItemMod != null) {
            itemPowerText = `Item Power: ${foundItemMod.modValue}`;
            itemPower.innerHTML = `${itemPowerText}`;
            itemGearDiv.appendChild(itemPower);
        }
        else {
            itemPowerText = `Item Power: 0`;
        }
        let itemStat = [];
        let itemStatDiv = [];
        let itemStatAffix = [];
        //for each stat
        let numAffixes = this.prefixes.length + this.suffixes.length;
        for (let i = 0; i < numAffixes; i++) {
            let affix;
            let affixText = "";
            //if looking at a prefix
            if (i < this.prefixes.length) {
                affix = this.prefixes[i];
                affixText = "P";
            }
            //if looking at a suffix
            else {
                affix = this.suffixes[i - this.prefixes.length];
                affixText = "S";
            }
            //create a div for the stat
            let statDiv = document.createElement('div');
            statDiv.classList.add("item-statDiv");
            statDiv.classList.add("small-margin");
            itemStatDiv.push(statDiv);
            //set the item stats
            let statAffix = document.createElement('p');
            statAffix.classList.add("item-stat-affix");
            statAffix.classList.add("small-margin");
            //add a newline between tier and name
            statAffix.innerHTML = `(${affixText}${affix.tier})<br>(${affix.name})`;
            statAffix.dataset.stat = affix.tags;
            statAffix.dataset.affix = `${affix.affix}`;
            itemStatAffix.push(statAffix);
            ;
            let stat = document.createElement('p');
            stat.classList.add("item-stat");
            stat.classList.add("small-margin");
            let text = setTextfromAffixes(affix.stat, affix.value);
            stat.innerHTML = `${text}`;
            stat.dataset.stat = affix.tags;
            stat.dataset.affix = `${affix.affix}`;
            itemStat.push(stat);
        }
        for (let i = 0; i < itemStat.length; i++) {
            itemStatDiv[i].appendChild(itemStatAffix[i]);
            itemStatDiv[i].appendChild(itemStat[i]);
        }
        for (let i = 0; i < itemStatDiv.length; i++) {
            itemStatsDiv.appendChild(itemStatDiv[i]);
        }
        let itemName = document.createElement('p');
        itemName.classList.add("item-name");
        itemName.innerHTML = `${this.rarity} ${this.baseType.name} ${this.baseType.gearType}`;
        itemNameDiv.appendChild(itemName);
    }
    setupDiv() {
        if (!this.setup) {
            this.setup = true;
            this.div.appendChild(this.imageDiv);
            if (this.container == craftingItemSectionDiv) {
                this.createFullText(this.div);
            }
            //set the item picture
            let itemPicture = document.createElement('img');
            itemPicture.classList.add("item-image");
            let picture = this.baseType.gearType.toLocaleLowerCase();
            itemPicture.src = `../dist/img/${picture}.png`;
            itemPicture.draggable = false;
            this.imageDiv.appendChild(itemPicture);
            //set the item picture background
            this.imageBG = document.createElement('img');
            this.imageBG.classList.add("item-image-bg");
            let pictureBG = this.baseType.gearType.toLocaleLowerCase() + '-bg';
            this.imageBG.src = `../dist/img/${pictureBG}.png`;
            this.imageBG.draggable = false;
            this.imageDiv.appendChild(this.imageBG);
            this.setRarityBorder();
        }
    }
    export() {
        let item = {
            id: this.id,
            type: this.type,
            baseType: this.baseType,
            prefixes: this.prefixes,
            suffixes: this.suffixes,
            rarity: this.rarity,
            itemMods: this.itemMods,
            mods: this.mods,
            containerNumber: this.containerNumber,
        };
        return item;
    }
}
