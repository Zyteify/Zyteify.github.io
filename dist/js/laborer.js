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
    vocation;
    id;
    static count = 0;
    resources = [];
    //empty array of items
    weapon;
    boot;
    image;
    //display
    div;
    container;
    paragraph;
    resourcesParagraphs;
    resourceDiv;
    gearDiv;
    //actions
    vocationActions; // Mapping of vocation to function
    constructor(name) {
        this.id = Laborer.count++;
        this.name = name;
        this.vocation = new Vocation('Vagrant');
        this.resources = [];
        this.weapon = null;
        this.boot = null;
        //actions
        this.vocationActions = {
            Vagrant: this.noAction,
            Farmer: this.farm,
            Guard: this.guard,
            Nurse: this.nurse,
            Builder: this.build,
            Cook: this.cook,
            Hunter: this.hunt,
            Crafter: this.craft,
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
        this.paragraph = null;
        this.resourcesParagraphs = [];
        this.resourceDiv = document.createElement('div');
        this.resourceDiv.id = "worker-resources-div" + this.id.toString();
        this.gearDiv = document.createElement('div');
        this.gearDiv.id = "worker-gear-div" + this.id.toString();
        this.setName();
        this.setupDiv();
    }
    randomiseName() {
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
        if (this.weapon == null) {
            this.vocation = new Vocation('Vagrant');
        }
        let gearType = this.weapon?.gear;
        if (vocationMap.hasOwnProperty(gearType)) {
            this.vocation.name = vocationMap[gearType];
            console.log(`Laborer's vocation changed to ${this.vocation.name}`);
        }
        else {
            console.log(`The item "${gearType}" does not have a corresponding vocation.`);
        }
    }
    doWork() {
        const action = this.vocationActions[this.vocation.name];
        if (action) {
            action(); // Call the corresponding vocation-specific function
        }
        this.setParagraph();
    }
    //add a resource to the worker
    addResource(resource) {
        let resourceExistsFlag = false;
        //check to see if the worker already has the resource
        //loop through each resource in the worker's inventory
        for (let i = 0; i < this.resources.length; i++) {
            //check to see if the worker has the resource
            if (this.resources[i].name === resource.name) {
                //add the resource to the worker's inventory
                this.resources[i].amount += resource.amount;
                resourceExistsFlag = true;
            }
        }
        if (!resourceExistsFlag) {
            //the worker does not have the resource, add it to the worker's inventory
            this.resources.push(resource);
        }
        this.setResourcesDisplay();
    }
    //remove a resource from the worker
    removeResource(resource) {
        resource.paragraph.remove();
        let index = this.resources.indexOf(resource);
        if (index > -1) {
            this.resources.splice(index, 1);
        }
    }
    //equip an item
    equipItem(item) {
        if (item.type == "weapon") {
            this.weapon = item;
        }
        else if (item.type == "boot") {
            this.boot = item;
        }
        this.setItemParent();
        this.setVocation();
    }
    //unequip an item
    unequipItem(item) {
        switch (item.type) {
            case "weapon":
                this.weapon = null;
                break;
            case "boot":
                this.boot = null;
                break;
            default:
                console.log('unknown weapon type');
                break;
        }
    }
    setItemParent() {
        //append the gear div to the worker div if it hasnt already
        if (this.gearDiv.parentElement == null) {
            this.div.appendChild(this.gearDiv);
        }
        if (this.weapon) {
            this.weapon.setParentDiv(this.gearDiv);
        }
    }
    depositResources() {
        //loop through each resource in the worker's inventory
        for (let i = 0; i < this.resources.length; i++) {
            //check to see if the stockpile has the resource
            let workerResource = this.resources[i];
            let homeResource = getResourceByName(workerResource.name);
            if (homeResource != null) {
                //add the resource to the homeResource
                let resourceToAdd = Math.min(workerResource.amount, 1);
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
            //if the resource has an amount of 0, remove it from the worker's inventory
            if (this.resources[i].amount <= 0) {
                this.removeResource(this.resources[i]);
            }
        }
        this.setResourcesDisplay();
    }
    setImage() {
        //if the image id has not been set, initialise the image
        if (this.image.id == "") {
            // Set the source attribute of the image
            this.image.src = 'dist/img/person.png';
            this.image.id = "worker-image" + this.id.toString();
            this.image.draggable = false;
            if (this.image.parentElement == null) {
                this.div.appendChild(this.image);
            }
        }
    }
    setParagraph() {
        //check to see if a paragraph element exists for this resource
        if (this.paragraph == null) {
            this.paragraph = document.createElement('p');
            this.paragraph.id = "worker" + this.id.toString();
            this.div.appendChild(this.paragraph);
        }
        this.paragraph.innerHTML = this.name + ": " + this.vocation.name;
    }
    setResourcesDisplay() {
        //append the resource div to the worker div if it hasnt already
        if (this.resourceDiv.parentElement == null) {
            this.div.appendChild(this.resourceDiv);
        }
        //check to see if a paragraph element exists for each resource and create it if neccessary
        for (let i = 0; i < this.resources.length; i++) {
            if (this.resources[i].paragraph.id == "") {
                this.resources[i].paragraph.id = "workerResources" + this.resources[i].name;
                this.resourceDiv.appendChild(this.resources[i].paragraph);
            }
            if (this.resources[i].paragraph.innerHTML != `${this.resources[i].icon} ${this.resources[i].amount}`) {
                this.resources[i].paragraph.innerHTML = `${this.resources[i].icon} ${this.resources[i].amount}`;
            }
        }
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
    farm() {
        //add food to the worker
        this.addResource(new Resource(ResourceType.food, 1, '🍞'));
    }
    mine() {
        console.log('mining');
    }
    chop() {
        //add wood to the worker
        this.addResource(new Resource(ResourceType.wood, 1, '🌲'));
    }
    craft() {
        console.log('crafting');
    }
    guard() {
        console.log('guarding');
    }
    nurse() {
        console.log('nursing');
    }
    build() {
        console.log('building');
    }
    cook() {
        console.log('cooking');
    }
    hunt() {
        console.log('hunting');
    }
    tax() {
        console.log('taxing');
    }
    gamble() {
        console.log('gambling');
    }
    merchant() {
        console.log('merchandising');
    }
    priest() {
        console.log('preaching');
    }
    research() {
        console.log('researching');
    }
    noAction() {
        console.log('no action');
    }
}
