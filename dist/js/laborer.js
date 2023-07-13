"use strict";
class Vocation {
    name;
    constructor(name) {
        this.name = name;
    }
}
//create the class worker
class Laborer {
    name;
    gender = 'female';
    vocation;
    id;
    static count = 0;
    resources = [];
    //empty array of items
    weapon = [];
    boot = [];
    image;
    //display
    div;
    container;
    paragraph;
    paragraphDiv;
    resourcesParagraphs;
    resourceDiv;
    gearDiv;
    //actions
    vocationActions; // Mapping of vocation to function
    static workSpeedUpgradeable = 10;
    energy = 0;
    rested = true;
    hunger = 0;
    workProgress = 0;
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
    properties = {
        workPower: 0,
        energyMax: 0,
        energyMin: 0,
        workProgress: 0,
        duplicateWorkChance: 0,
        chanceToRepeatGreatestWork: 0,
        criticalWorkChance: 0,
        criticalWorkMultiplier: 0,
        chanceToNotConsumeEnergy: 0,
        multiplyStock: 0,
        repeatGreatestWorkCount: 0,
    };
    flags = {
        duplicateWork: false,
        repeatGreatestWork: false,
        criticalWork: false,
        notConsumeEnergy: false,
        multiplyStock: false,
    };
    constructor(name, gender) {
        if (gender) {
            this.gender = gender;
        }
        this.id = Laborer.count++;
        this.name = 'temp';
        this.vocation = new Vocation('Beggar');
        this.resources = [];
        this.weapon = [];
        this.boot = [];
        this.energy = 10;
        this.calculateMods();
        //actions
        this.vocationActions = {
            Beggar: this.beg,
            Farmer: this.farm,
            Guard: this.guard,
            Nurse: this.nurse,
            Blacksmith: this.craft,
            Cook: this.cook,
            Hunter: this.hunt,
            Gemcutter: this.gemcut,
            Researcher: this.research,
            Gambler: this.gamble,
            Taxer: this.tax,
            Merchant: this.merchant,
            Priest: this.priest,
            Miner: this.mine,
            Woodcutter: this.chop,
        };
        //div
        this.div = document.createElement('div');
        this.div.id = "worker-div" + this.id.toString();
        this.div.className = "worker-div";
        //image
        this.image = new Image();
        //container
        this.container = document.getElementById('worker-list');
        //paragraph
        this.paragraph = [];
        this.resourcesParagraphs = [];
        this.paragraphDiv = document.createElement('div');
        this.paragraphDiv.id = "worker-paragraph-div" + this.id.toString();
        this.resourceDiv = document.createElement('div');
        this.resourceDiv.id = "worker-resources-div" + this.id.toString();
        this.resourceDiv.classList.add('worker-resources-div');
        this.gearDiv = document.createElement('div');
        this.gearDiv.id = "worker-gear-div" + this.id.toString();
        this.setName(name);
        this.setupDiv();
    }
    calculateMods() {
        //reset mods
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
        // Loop through each item in the worker's inventory
        this.weapon.reduce((acc, weaponItem) => {
            const weaponMods = weaponItem.mods;
            Object.keys(acc).forEach((key) => {
                acc[key] += weaponMods[key];
            });
            return acc;
        }, this.mods);
        this.calculateProperties();
    }
    calculateProperties() {
        //reset properties
        this.properties = {
            workPower: 0,
            energyMax: 0,
            energyMin: 0,
            workProgress: 0,
            duplicateWorkChance: 0,
            chanceToRepeatGreatestWork: 0,
            criticalWorkChance: 0,
            criticalWorkMultiplier: 0,
            chanceToNotConsumeEnergy: 0,
            multiplyStock: 0,
            repeatGreatestWorkCount: 0,
        };
        this.properties.workPower = (this.mods.itemPower + this.mods.itemPowerLocalAddition) * (1 + (this.mods.itemPowerLocalMultiplier / 100));
        this.properties.duplicateWorkChance = this.mods.duplicateWork;
        this.properties.chanceToRepeatGreatestWork = this.mods.chanceToRepeatGreatestWork;
        this.properties.criticalWorkChance = 0.05 + this.mods.criticalWorkChance;
        this.properties.criticalWorkMultiplier = 1 + this.mods.criticalWorkMultiplier;
        this.properties.chanceToNotConsumeEnergy = this.mods.chanceToNotConsumeEnergy;
        this.properties.multiplyStock = this.mods.multiplyStock;
        this.properties.repeatGreatestWorkCount = 0;
        //energy
        this.properties.energyMax = Laborer.workSpeedUpgradeable;
        this.properties.energyMin = 1;
    }
    randomiseName() {
        if (this.gender == 'male') {
            var nameList = nameListBoy;
        }
        else {
            var nameList = NameListGirl;
        }
        if (nameList.length == 0) {
            console.log('error');
            return this.id.toString();
        }
        else {
            // Pick a random name
            const randomIndex = Math.floor(Math.random() * nameList.length);
            const name = nameList[randomIndex];
            //remove the name from the list
            nameList.splice(randomIndex, 1);
            return name;
        }
    }
    setName(name) {
        if (name) {
            this.name = name;
        }
        else {
            this.name = this.randomiseName();
        }
    }
    setVocation() {
        if (this.weapon[0] == null) {
            this.vocation = new Vocation('Beggar');
        }
        else {
            let gearType = this.weapon[0]?.baseType.gearType;
            if (vocationMap.hasOwnProperty(gearType)) {
                this.vocation.name = vocationMap[gearType];
            }
            else {
                console.log(`The item "${gearType}" does not have a corresponding vocation.`);
            }
        }
        //update text
        this.setParagraph();
        //when they change vocation, they should lose their work progress
        this.workProgress = 0;
    }
    calculateDuplicateWork() {
        //reset duplicate work
        this.flags.duplicateWork = false;
        //duplicate work
        if (Math.random() < this.properties.duplicateWorkChance) {
            this.flags.duplicateWork = true;
        }
    }
    calculateChances() {
        //reset flags
        this.flags = {
            duplicateWork: false,
            repeatGreatestWork: false,
            criticalWork: false,
            notConsumeEnergy: false,
            multiplyStock: false,
        };
        //critical work
        if (Math.random() < this.properties.criticalWorkChance) {
            this.flags.criticalWork = true;
        }
        //not consume energy
        if (Math.random() < this.properties.chanceToNotConsumeEnergy) {
            this.flags.notConsumeEnergy = true;
        }
        //multiply stock
        if (Math.random() < this.properties.multiplyStock) {
            this.flags.multiplyStock = true;
        }
    }
    doWork() {
        let numWorks = 1;
        this.calculateDuplicateWork();
        if (this.flags.duplicateWork) {
            numWorks = 2;
        }
        for (let i = 0; i < numWorks; i++) {
            this.calculateChances();
            let workPower = this.properties.workPower;
            //if critical work
            if (this.flags.criticalWork) {
                workPower = this.properties.workPower * this.properties.criticalWorkMultiplier;
            }
            workPower = Math.floor(workPower);
            //doing work now
            this.workProgress += this.energy;
            if (this.workProgress >= 100) {
                this.workProgress -= 100;
                //do the work
                this.vocationActions[this.vocation.name].call(this, workPower);
                if (!this.flags.notConsumeEnergy) {
                    this.energy -= 1;
                }
                this.hunger += 1;
            }
            this.rested = false;
            if (this.flags.multiplyStock) {
                //loop through each resource in the worker's inventory
                for (let i = 0; i < this.resources.length; i++) {
                    //multiply the amount by 1.1
                    this.resources[i].amount = Math.floor(1.1 * this.resources[i].amount);
                }
            }
        }
        this.setParagraph();
    }
    //add a resource to the worker
    addResource(resource) {
        let resourceExistsFlag = false;
        let existingResource = null;
        //check to see if the worker already has the resource
        //loop through each resource in the worker's inventory
        for (let i = 0; i < this.resources.length; i++) {
            //check to see if the worker has the resource
            if (this.resources[i].name === resource.name) {
                //add the resource to the worker's inventory
                this.resources[i].amount += resource.amount;
                resourceExistsFlag = true;
                existingResource = this.resources[i];
            }
        }
        if (!resourceExistsFlag) {
            //the worker does not have the resource, add it to the worker's inventory
            this.resources.push(resource);
            resource.active = true;
            resource.display();
        }
        else {
            if (existingResource) {
                existingResource.display();
            }
            //remove the extra resource
            resource.div.remove();
        }
        this.setResourcesDisplay();
    }
    //remove a resource from the worker
    removeResource(resource) {
        this.resourceDiv.removeChild(resource.div);
        resource.div.remove();
        let index = this.resources.indexOf(resource);
        if (index > -1) {
            this.resources.splice(index, 1);
        }
    }
    //equip an item
    equipItem(item) {
        if (item.type == "Weapon") {
            this.weapon[0] = item;
        }
        else if (item.type == "Boot") {
            this.boot[0] = item;
        }
        this.setItemParent();
        this.setVocation();
        this.calculateMods();
    }
    //unequip an item
    unequipItem(item) {
        switch (item.type) {
            case "Weapon":
                removeItem(item, this.weapon);
                break;
            case "Boot":
                removeItem(item, this.boot);
                break;
            default:
                console.log('unknown weapon type');
                break;
        }
        this.calculateMods();
    }
    setItemParent() {
        //append the gear div to the worker div if it hasnt already
        if (this.gearDiv.parentElement == null) {
            this.div.appendChild(this.gearDiv);
        }
        if (this.weapon[0]) {
            this.weapon[0].setParentDiv(this.gearDiv);
        }
    }
    depositResources(amount) {
        //loop through each resource in the worker's inventory
        for (let i = 0; i < this.resources.length; i++) {
            //check to see if the stockpile has the resource
            let workerResource = this.resources[i];
            let homeResource = getResourceByName(workerResource.name);
            if (homeResource != null) {
                //add the resource to the homeResource
                let resourceToAdd = Math.min(workerResource.amount, amount);
                homeResource.amount += resourceToAdd;
                //subtract the resource from the worker's inventory
                workerResource.amount -= resourceToAdd;
            }
            else {
                //log error
                console.log("Error: Resource not found in home stockpile");
            }
        }
        //clear the worker's inventory
        //loop through each resource in the worker's inventory
        for (let i = 0; i < this.resources.length; i++) {
            this.resources[i].display();
            //if the resource has an amount of 0, remove it from the worker's inventory
            if (this.resources[i].amount <= 0) {
                this.removeResource(this.resources[i]);
            }
        }
        this.setResourcesDisplay();
    }
    //consume food to do get the work speed back to normal
    eat() {
        let food = getResourceByName('food');
        if (food != null && food.amount > 0 && this.energy < this.properties.energyMax) {
            food.amount -= 1;
            this.energy += 1;
            this.hunger -= 1;
            this.setParagraph();
        }
    }
    //rest to get the work speed up
    rest() {
        if (this.energy < this.properties.energyMax) {
            this.energy += 1;
            if (this.energy < this.properties.energyMax) {
                this.energy += 1;
                this.setParagraph();
            }
            this.setParagraph();
        }
        this.rested = true;
    }
    setImage() {
        //if the image id has not been set, initialise the image
        if (this.image.id == "") {
            // Set the source attribute of the image
            this.image.src = 'dist/img/characters/char.png';
            this.image.id = "worker-image" + this.id.toString();
            this.image.draggable = false;
            this.image.classList.add('worker-image');
            if (this.image.parentElement == null) {
                this.div.appendChild(this.image);
            }
        }
    }
    setParagraph() {
        if (this.paragraphDiv.parentElement == null) {
            this.div.appendChild(this.paragraphDiv);
        }
        if (this.paragraph.length == 0) {
            this.paragraph.push(document.createElement('p'));
            this.paragraph.push(document.createElement('p'));
            this.paragraph.push(document.createElement('p'));
        }
        //loop through each paragraph element and create it if it doesn't exist
        for (let i = 0; i < this.paragraph.length; i++) {
            //check to see if a paragraph element exists for this resource
            if (this.paragraph[i].id == '') {
                this.paragraph[i].id = "worker" + this.id.toString();
                this.paragraphDiv.appendChild(this.paragraph[i]);
            }
            switch (i) {
                case (0):
                    this.paragraph[i].innerHTML = this.name + ": " + this.vocation.name;
                    break;
                case (1):
                    this.paragraph[i].innerHTML = "Work Progress: " + this.workProgress.toString();
                    break;
                case (2):
                    this.paragraph[i].innerHTML = "Work Speed: " + this.energy.toString();
                    break;
                default:
                    console.log('error');
                    break;
            }
        }
    }
    setResourcesDisplay() {
        //append the resource div to the worker div if it hasnt already
        if (this.resourceDiv.parentElement == null) {
            this.div.appendChild(this.resourceDiv);
        }
        /*         //check to see if a paragraph element exists for each resource and create it if neccessary
                for (let i = 0; i < this.resources.length; i++) {
                    if (this.resources[i].paragraph.id == "") {
                        this.resources[i].paragraph.id = "workerResources" + this.resources[i].name;
                        this.resourceDiv.appendChild(this.resources[i].paragraph);
                        this.resources[i].paragraph.innerHTML = `${this.resources[i].icon} ${this.resources[i].amount}`;
                    }
                    if (this.resources[i].paragraph.innerHTML != `${this.resources[i].icon} ${this.resources[i].amount}`) {
                        this.resources[i].paragraph.innerHTML = `${this.resources[i].icon} ${this.resources[i].amount}`;
                    }
                } */
    }
    setupDiv() {
        //append the div to the container if it hasnt already
        if (this.div.parentElement == null) {
            this.container.appendChild(this.div);
        }
        //set the id and class of the div
        this.div.id = "worker-div" + this.id.toString();
        this.div.className = "worker-div";
        //append the paragraph to the div if it hasnt already
        this.setParagraph();
        //append the image to the div if it hasnt already
        this.setImage();
        //append the gear to the div if it hasnt already
        this.setItemParent();
        //append the resources to the div if they havent already
        this.setResourcesDisplay();
    }
    guard(workPower) {
    }
    cook(workPower) {
    }
    farm(workPower) {
        //add food to the worker
        let resource = new Resource('food', this.resourceDiv, workPower);
        this.addResource(resource);
    }
    mine(workPower) {
        for (let i = 0; i < workPower; i++) {
            this.mineOnce();
        }
    }
    mineOnce() {
        //have an x chance of getting a resource
        //add a resource to the worker
        let stoneChance = 0.8;
        let copperChance = 0.1;
        let silverChance = 0.1;
        let goldChance = 0.01;
        let totalWinChance = stoneChance + copperChance + silverChance + goldChance;
        let random = Math.random() * totalWinChance;
        switch (true) {
            case (random < stoneChance):
                this.addResource(new Resource('stone', this.resourceDiv, 1));
                break;
            case (random < stoneChance + copperChance):
                this.addResource(new Resource('copper', this.resourceDiv, 1));
                break;
            case (random < stoneChance + copperChance + silverChance):
                this.addResource(new Resource('silver', this.resourceDiv, 1));
                break;
            case (random < stoneChance + copperChance + silverChance + goldChance):
                this.addResource(new Resource('gold', this.resourceDiv, 1));
                break;
            default:
                console.log('incorrect chances in mineOnce');
                break;
        }
    }
    merchant(workPower) {
    }
    priest(workPower) {
    }
    chop(workPower) {
        //add wood to the worker
        this.addResource(new Resource('wood', this.resourceDiv, workPower));
    }
    craft(workPower) {
        craftWork += workPower;
        updateCraftButton();
    }
    //give energy to all other workers
    nurse(workPower) {
        //todo make workpower do something
        for (let i = 0; i < workers.length; i++) {
            if (workers[i].id != this.id) {
                workers[i].rest();
            }
        }
    }
    gemcut(workPower) {
    }
    hunt(workPower) {
        let huntChance = 0.35;
        let random = Math.random();
        if (random < huntChance) {
            //add food to the worker
            let resource = new Resource('food', this.resourceDiv, 10 * workPower);
            this.addResource(resource);
        }
        this.addResource(new Resource('food', this.resourceDiv, 0));
    }
    tax(workPower) {
        //get the number of workers who aren't vagrants or taxers
        let workerCount = 0;
        for (let i = 0; i < workers.length; i++) {
            if (workers[i].vocation.name != 'Beggar' && workers[i].vocation.name != 'Taxer') {
                workerCount++;
            }
        }
        let amount = workerCount * workPower;
        if (amount > 0) {
            let resource = new Resource('coins', this.resourceDiv, amount);
            this.addResource(resource);
        }
    }
    gamble(workPower) {
        let winChance = 0.15;
        let random = Math.random();
        if (random < winChance) {
            let amount = 0;
            let winChanceBig = 0.01;
            let winChanceSmall = 0.15;
            let winChanceHuge = 0.001;
            // Generate a random number between 0 and the total probability range
            let totalWinChance = winChanceBig + winChanceSmall + winChanceHuge;
            let random = Math.random() * totalWinChance;
            switch (true) {
                case (random < winChanceSmall):
                    amount = 10 * workPower;
                    break;
                case (random < winChanceSmall + winChanceBig):
                    amount = 100 * workPower;
                    break;
                case (random < winChanceSmall + winChanceBig + winChanceHuge):
                    amount = 1000 * workPower;
                    break;
                default:
                    amount = 1;
                    console.log('error chances in gambler');
                    break;
            }
            let resource = new Resource('coins', this.resourceDiv, amount);
            this.addResource(resource);
        }
        new Resource('coins', this.resourceDiv, 0);
    }
    research(workPower) {
        upgradePoints += workPower;
    }
    beg(workPower) {
        if (workPower == 0) {
            workPower = 1;
        }
        let resource;
        //10% chance to get 1 coin/food
        let chance = 0.4;
        let random = Math.random();
        let amount = 1;
        if (random < chance) {
            let chanceCoin = 0.5;
            let chanceFood = 0.5;
            let totalWinChance = chanceCoin + chanceFood;
            let random = Math.random() * totalWinChance;
            switch (true) {
                case (random < chanceCoin):
                    resource = new Resource('coins', this.resourceDiv, workPower);
                    break;
                case (random < chanceCoin + chanceFood):
                    resource = new Resource('food', this.resourceDiv, workPower);
                    break;
                default:
                    console.log('error chances in beg');
                    resource = new Resource('coins', this.resourceDiv, 0);
                    break;
            }
            this.addResource(resource);
        }
        //always add 1 coins and food to show that the worker is begging
        resource = new Resource('coins', this.resourceDiv, 1);
        this.addResource(resource);
        resource = new Resource('food', this.resourceDiv, 0);
        this.addResource(resource);
    }
}
function getWorkerById(id) {
    for (let i = 0; i < workers.length; i++) {
        if (workers[i].id === id) {
            return workers[i];
        }
    }
    return null;
}
