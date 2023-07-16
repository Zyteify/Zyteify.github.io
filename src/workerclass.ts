type ClassType = "Beggar" | 'Farmer' | 'Guard' | 'Nurse' |
    'Blacksmith' | 'Cook' | 'Hunter' | 'Gemcutter' | 'Taxer' |
    'Gambler' | 'Merchant' | 'Priest' | 'Researcher' | 'Miner' |
    'Woodcutter';

class Vocation {
    name: ClassType;

    constructor(name: ClassType) {
        this.name = name;
    }
}


//create the class worker
class WorkerClass {
    name: string;
    gender: string = 'female';
    vocation: Vocation;
    id: number;
    static count: number = 0;

    resources: Resource[] = [];
    //empty array of items
    weapon: Item[] = [];
    boot: Item[] = [];
    shirt: Item[] = [];
    hat: Item[] = [];
    image: HTMLImageElement;
    placeholderImages: HTMLImageElement[] = [];

    //display
    div: HTMLDivElement;
    container: HTMLDivElement;
    paragraphDiv: HTMLDivElement;
    resourcesParagraphs: HTMLParagraphElement[];
    resourceDiv: HTMLDivElement;
    displayWeaponDiv: HTMLDivElement;
    displayBootDiv: HTMLDivElement;
    displayShirtDiv: HTMLDivElement;
    displayHatDiv: HTMLDivElement;
    displayName: HTMLParagraphElement;
    displayVocation: HTMLParagraphElement;
    displayProgress: HTMLProgressElement;
    displayEnergy: HTMLParagraphElement;
    displayActivity: HTMLParagraphElement;
    displayStat: HTMLParagraphElement;
    displayHunger: HTMLParagraphElement;

    //actions
    vocationActions: Record<ClassType, (workPower: number) => void>; // Mapping of vocation to function

    static workSpeedUpgradeable: number = 10;
    energy: number = 0;
    rested: boolean = true
    hunger: number = 0;
    workProgress: number = 0;
    activity: string = 'resting'

    mods: Mods = {
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
    }

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
    }

    flags = {
        duplicateWork: false,
        repeatGreatestWork: false,
        criticalWork: false,
        notConsumeEnergy: false,
        multiplyStock: false,
    }

    constructor(full?: any) {
        this.id = WorkerClass.count++;
        if (full) {
            this.name = full.name;
            this.energy = full.energy;
            this.rested = full.rested;
            this.hunger = full.hunger;
            this.workProgress = full.workProgress;
        } else {
            this.name = 'temp';
            this.setName()
        }


        this.vocation = new Vocation('Beggar');

        this.resources = [];
        this.weapon = [];
        this.boot = [];
        this.energy = WorkerClass.workSpeedUpgradeable;

        this.calculateMods()

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

        //image
        this.image = new Image();
        //container
        this.container = document.getElementById('worker-list') as HTMLDivElement;
        this.displayName = document.createElement('p');
        this.displayVocation = document.createElement('p');
        this.displayProgress = document.createElement('progress');
        this.displayEnergy = document.createElement('p');
        this.displayActivity = document.createElement('p');
        this.displayStat = document.createElement('p');
        this.displayHunger = document.createElement('p');
        this.displayWeaponDiv = document.createElement('div');
        this.displayBootDiv = document.createElement('div');
        this.displayShirtDiv = document.createElement('div');
        this.displayHatDiv = document.createElement('div');

        this.resourcesParagraphs = [];
        this.paragraphDiv = document.createElement('div');
        this.paragraphDiv.id = "worker-paragraph-div" + this.id.toString();
        this.resourceDiv = document.createElement('div');
        this.resourceDiv.id = "worker-resources-div" + this.id.toString();
        this.resourceDiv.classList.add('worker-resources-div');

        this.setupDiv()


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
        }

        // Loop through each item in the worker's inventory
        this.weapon.reduce((acc, weaponItem) => {
            const weaponMods = weaponItem.mods;
            Object.keys(acc).forEach((key) => {
                acc[key as keyof Mods] += weaponMods[key as keyof Mods];
            });
            return acc;
        }, this.mods);

        this.calculateProperties()

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
        }

        this.properties.workPower = (this.mods.itemPower + this.mods.itemPowerLocalAddition) * (1 + (this.mods.itemPowerLocalMultiplier / 100));
        this.properties.duplicateWorkChance = this.mods.duplicateWork;
        this.properties.chanceToRepeatGreatestWork = this.mods.chanceToRepeatGreatestWork;
        this.properties.criticalWorkChance = 0.05 + this.mods.criticalWorkChance;
        this.properties.criticalWorkMultiplier = 1 + this.mods.criticalWorkMultiplier;
        this.properties.chanceToNotConsumeEnergy = this.mods.chanceToNotConsumeEnergy;
        this.properties.multiplyStock = this.mods.multiplyStock;
        this.properties.repeatGreatestWorkCount = 0;

        //energy
        this.properties.energyMax = WorkerClass.workSpeedUpgradeable
        this.properties.energyMin = 1

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
        } else {
            // Pick a random name
            const randomIndex = Math.floor(Math.random() * nameList.length);
            const name = nameList[randomIndex];
            //remove the name from the list
            nameList.splice(randomIndex, 1);
            return name
        }
    }

    setName(name?: string) {
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
            let gearType: GearType = <GearType>this.weapon[0]?.baseType.gearType;
            if (vocationMap.hasOwnProperty(gearType)) {
                this.vocation.name = vocationMap[gearType];
            } else {
                console.log(`The item "${gearType}" does not have a corresponding vocation.`);
            }
        }


        //update text
        this.updateDisplayVocation()

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
        }
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

        this.calculateDuplicateWork()
        if (this.flags.duplicateWork) {
            numWorks = 2;
        }

        for (let i = 0; i < numWorks; i++) {

            this.calculateChances()

            let workPower = this.properties.workPower

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
                    this.energy -= 1
                }
                this.hunger += 1
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
        this.updateDisplayActivity()
        this.updateDisplayEnergy()
        this.updateDisplayHunger()
        this.updateDisplayProgress()
    }

    //add a resource to the worker
    addResource(resource: Resource) {
        let resourceExistsFlag = false;
        let existingResource: Resource | null = null;
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
        this.updateResourceDiv();
    }

    //remove a resource from the worker
    removeResource(resource: Resource) {
        this.resourceDiv.removeChild(resource.div);
        resource.div.remove();


        let index = this.resources.indexOf(resource);
        if (index > -1) {
            this.resources.splice(index, 1);
        }
    }

    //equip an item
    equipItem(item: Item) {
        if (item.type == "Weapon") {
            this.weapon[0] = item;
        } else if (item.type == "Boot") {
            this.boot[0] = item;
        }
        this.setItemParent();
        this.setVocation();
        this.calculateMods();
    }

    //unequip an item
    unequipItem(item: Item) {
        switch (item.type) {
            case "Weapon":
                removeItem(item, this.weapon)
                break;
            case "Boot":
                removeItem(item, this.boot)
                break;
            default:
                console.log('unknown weapon type');
                break;
        }
        this.setItemParent();
        this.calculateMods();
    }

    depositResources(amount: number): boolean {
        let deposited: boolean = false
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
                deposited = true
                break

            } else {
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
        this.updateResourceDiv();
        displayResources()

        return deposited
    }

    //consume food to do get the work speed back to normal
    eat() {
        let food = getResourceByName('food');
        //check if we have food and if we need to eat
        //loop through each resource in the worker's inventory
        for (let i = 0; i < this.resources.length; i++) {
            //check to see if the worker has food
            if (this.resources[i].name === 'food') {
                food = this.resources[i];
            }
        }

        if (food != null && food.amount > 0 && this.energy < this.properties.energyMax) {
            food.amount -= 1;
            this.energy += 1;
            this.hunger -= 1;
            this.activity = 'eating'
            food.display();
            this.updateDisplayActivity()
            this.updateDisplayEnergy()
            this.updateDisplayHunger()
        }
        else if (this.depositResources(1)) {
            this.activity = 'depositing'
            this.updateDisplayActivity()
        }
        else {
            this.activity = 'sleeping'
            this.updateDisplayActivity()
        }
    }

    //rest to get the work speed up
    rest() {
        if (this.energy < this.properties.energyMax) {
            let energyRestored = Math.min(this.properties.energyMax - this.energy, 2)
            this.energy += energyRestored;
            this.hunger -= energyRestored;
            this.updateDisplayEnergy()
            this.activity = 'resting'
            this.updateDisplayActivity()
        }
        this.rested = true;
    }

    //set the parent div of the items or the placeholder div
    setItemParent() {
        if (this.weapon[0]) {
            //remove the placeholder image
            this.placeholderImages[0].remove();
            this.weapon[0].setParentDiv(this.displayWeaponDiv);
        }
        else {
            this.displayWeaponDiv.appendChild(this.placeholderImages[0]);
        }
        if (this.shirt[0]) {
            //remove the placeholder image
            this.placeholderImages[1].remove();
            this.boot[0].setParentDiv(this.displayShirtDiv);
        }
        else {
            this.displayShirtDiv.appendChild(this.placeholderImages[1]);
        }
        if (this.hat[0]) {
            //remove the placeholder image
            this.placeholderImages[2].remove();
            this.hat[0].setParentDiv(this.displayHatDiv);
        }
        else {
            this.displayHatDiv.appendChild(this.placeholderImages[2]);
        }
        if (this.boot[0]) {
            //remove the placeholder image
            this.placeholderImages[3].remove();
            this.boot[0].setParentDiv(this.displayBootDiv);
        }
        else {
            this.displayBootDiv.appendChild(this.placeholderImages[3]);
        }
    }

    getItemDiv(baseType: BaseType) {
        switch (baseType.gearSlot) {
            case 'Weapon':
                return this.displayWeaponDiv
            case 'Shirt':
                return this.displayShirtDiv
            case 'Hat':
                return this.displayBootDiv
            case 'Boot':
                return this.displayBootDiv
            default:
                console.log('unknown gear type');
                return this.displayWeaponDiv
        }
    }

    updateResourceDiv() {
        //loop through each resource in the worker's inventory
        for (let i = 0; i < this.resources.length; i++) {
            this.resources[i].display();
        }
    }

    setCharacterImage(div: HTMLDivElement) {
        // Set the source attribute of the image
        this.image.src = 'dist/img/characters/char.png';
        this.image.id = "worker-image" + this.id.toString();
        this.image.draggable = false
        this.image.classList.add('worker-image');
        div.appendChild(this.image);
    }

    setPlaceholderImages() {
        // Set the source attribute of the image
        this.placeholderImages = [
            new Image(),
            new Image(),
            new Image(),
            new Image(),
        ];
        this.placeholderImages[0].src = 'dist/img/placeholders/weapon-image.png';
        this.placeholderImages[0].id = "worker-image" + this.id.toString();
        this.placeholderImages[0].draggable = false
        this.placeholderImages[0].classList.add('image');
        this.placeholderImages[0].classList.add('placeholder-image');
        this.placeholderImages[1].src = 'dist/img/placeholders/shirt-image.png';
        this.placeholderImages[1].id = "worker-image" + this.id.toString();
        this.placeholderImages[1].draggable = false
        this.placeholderImages[1].classList.add('image');
        this.placeholderImages[1].classList.add('placeholder-image');
        this.placeholderImages[2].src = 'dist/img/placeholders/hat-image.png';
        this.placeholderImages[2].id = "worker-image" + this.id.toString();
        this.placeholderImages[2].draggable = false
        this.placeholderImages[2].classList.add('image');
        this.placeholderImages[2].classList.add('placeholder-image');
        this.placeholderImages[3].src = 'dist/img/placeholders/boots-image.png';
        this.placeholderImages[3].id = "worker-image" + this.id.toString();
        this.placeholderImages[3].draggable = false
        this.placeholderImages[3].classList.add('image');
        this.placeholderImages[3].classList.add('placeholder-image');
    }

    updateDisplayVocation() {
        if (this.displayVocation.innerHTML = this.vocation.name) {
            this.displayVocation.innerHTML = this.vocation.name;
        }
    }

    updateDisplayProgress() {
        if (this.displayProgress.value = this.workProgress) {
            this.displayProgress.value = this.workProgress;
            this.displayProgress.max = 100;
        }
    }

    updateDisplayEnergy() {
        if (this.displayEnergy.innerHTML != `🔋${this.energy.toString()}`) {
            this.displayEnergy.innerHTML = `🔋${this.energy.toString()}`
        }
    }

    updateDisplayHunger() {
        if (this.displayHunger.innerHTML != `${this.hunger}`) {
            this.displayHunger.innerHTML = `${this.hunger}`
        }
    }

    updateDisplayActivity() {
        if (this.displayActivity.innerHTML != `${this.activity}`) {
            this.displayActivity.innerHTML = `${this.activity}`
        }
    }

    updateDisplayStat() {
        //loop through each mod
        for (let i = 0; i < Object.keys(this.mods).length; i++) {
            let modName = Object.keys(this.mods)[i] as keyof Mods;
            let modValue = this.mods[modName];
            if (modValue != 0) {
                //create a paragraph for the stat
                const p = document.createElement('p');
                p.id = `worker-name${this.id.toString()}${modName}`;
                p.classList.add('worker-stat-item');
                p.innerHTML = `${modName}: ${modValue}`;
                this.displayStat.appendChild(p);
            }

        }
    }

    setupDiv() {
        //append the div to the container if it hasnt already
        if (this.div.parentElement == null) {
            this.container.appendChild(this.div);
        }

        //set the id and class of the div
        if (this.div.id != `worker-div${this.id.toString()}`) {
            this.div.id = `worker-div${this.id.toString()}`;
            this.div.className = "worker-div";

            //left most panel
            {
                //worker inventory+name div
                const workerinventoryNameDiv = document.createElement('div');
                workerinventoryNameDiv.id = "worker-inventory-name-div" + this.id.toString();
                workerinventoryNameDiv.classList.add('worker-inventory-name-div');
                this.div.appendChild(workerinventoryNameDiv);

                //display name
                this.displayName.id = `worker-name${this.id.toString()}displayName`;
                this.displayName.classList.add('worker-name');
                this.displayName.innerHTML = this.name;
                workerinventoryNameDiv.appendChild(this.displayName);

                //worker inventory div
                const workerInventoryDiv = document.createElement('div');
                workerInventoryDiv.id = "worker-inventory-div" + this.id.toString();
                workerInventoryDiv.classList.add('worker-inventory-div');
                workerinventoryNameDiv.appendChild(workerInventoryDiv);

                //worker image
                this.setCharacterImage(workerInventoryDiv)

                //worker inventory gear div
                const workerInventoryGearDiv = document.createElement('div');
                workerInventoryGearDiv.id = "worker-inventory-gear-div" + this.id.toString();
                workerInventoryGearDiv.classList.add('worker-inventory-gear-div');
                workerInventoryDiv.appendChild(workerInventoryGearDiv);

                //worker weapon-shirt div
                const workerWeaponShirtDiv = document.createElement('div');
                workerWeaponShirtDiv.id = "worker-weapon-shirt-div" + this.id.toString();
                workerWeaponShirtDiv.classList.add('worker-weapon-shirt-div');
                workerInventoryGearDiv.appendChild(workerWeaponShirtDiv);

                //worker weapon div
                this.displayWeaponDiv.id = "worker-weapon-div" + this.id.toString();
                this.displayWeaponDiv.classList.add('worker-weapon-div');
                this.displayWeaponDiv.classList.add('image-div')
                workerWeaponShirtDiv.appendChild(this.displayWeaponDiv);

                //worker shirt div
                this.displayShirtDiv.id = "worker-shirt-div" + this.id.toString();
                this.displayShirtDiv.classList.add('worker-shirt-div');
                this.displayShirtDiv.classList.add('image-div')
                workerWeaponShirtDiv.appendChild(this.displayShirtDiv);

                //worker boots-hat div
                const workerBootsHatDiv = document.createElement('div');
                workerBootsHatDiv.id = "worker-boots-hat-div" + this.id.toString();
                workerBootsHatDiv.classList.add('worker-boots-hat-div');
                workerInventoryGearDiv.appendChild(workerBootsHatDiv);

                //worker hat div
                this.displayHatDiv.id = "worker-hat-div" + this.id.toString();
                this.displayHatDiv.classList.add('worker-hat-div');
                this.displayHatDiv.classList.add('image-div')
                workerBootsHatDiv.appendChild(this.displayHatDiv);

                //worker boots div
                this.displayBootDiv.id = "worker-boots-div" + this.id.toString();
                this.displayBootDiv.classList.add('worker-boots-div');
                this.displayBootDiv.classList.add('image-div')
                workerBootsHatDiv.appendChild(this.displayBootDiv);

                this.setPlaceholderImages()
            }

            //right panel
            {
                //worker stat container div@
                const workerStatContainerDiv = document.createElement('div');
                workerStatContainerDiv.id = "worker-stat-container-div" + this.id.toString();
                workerStatContainerDiv.classList.add('worker-stat-container-div');
                this.div.appendChild(workerStatContainerDiv);

                //display vocation
                this.displayVocation.id = `worker-name${this.id.toString()}vocation`;
                this.displayVocation.classList.add('worker-vocation');
                workerStatContainerDiv.appendChild(this.displayVocation);
                this.updateDisplayVocation()

                //worker activity
                this.displayActivity.id = `worker-name${this.id.toString()}activity`;
                this.displayActivity.classList.add('worker-activity');
                workerStatContainerDiv.appendChild(this.displayActivity);
                this.updateDisplayActivity()

                //worker progress div
                const workerProgressDiv = document.createElement('div');
                workerProgressDiv.id = "worker-progress-div" + this.id.toString();
                workerProgressDiv.classList.add('worker-progress-div');
                workerStatContainerDiv.appendChild(workerProgressDiv);

                //worker progress bar
                this.displayProgress.id = `worker-name${this.id.toString()}progress`;
                this.displayProgress.classList.add('worker-progress');
                workerProgressDiv.appendChild(this.displayProgress);
                this.updateDisplayProgress()

                //worker energy
                this.displayEnergy.id = `worker-name${this.id.toString()}energy`;
                this.displayEnergy.classList.add('worker-energy');
                workerProgressDiv.appendChild(this.displayEnergy);
                this.updateDisplayEnergy()
                this.displayEnergy.innerHTML = `🔋${this.energy.toString()}`

                /* //worker hunger
                this.displayHunger.id = `worker-name${this.id.toString()}hunger`;
                this.displayHunger.classList.add('worker-hunger');
                workerProgressDiv.appendChild(this.displayHunger);
                this.updateDisplayHunger() */

                //worker stats div
                const workerStatsDiv = document.createElement('div');
                workerStatsDiv.id = "worker-stats-div" + this.id.toString();
                workerStatsDiv.classList.add('worker-stats-div');
                workerStatContainerDiv.appendChild(workerStatsDiv);                

                //worker resources div
                this.resourceDiv.id = "worker-resources-div" + this.id.toString();
                this.resourceDiv.classList.add('worker-resources-div');
                workerStatsDiv.appendChild(this.resourceDiv);

                //worker stat list div
                const workerStatListDiv = document.createElement('div');
                workerStatListDiv.id = "worker-stat-list-div" + this.id.toString();
                workerStatListDiv.classList.add('worker-stat-list-div');
                workerStatContainerDiv.appendChild(workerStatListDiv);

                //worker stat
                workerStatListDiv.id = "worker-stat-div" + this.id.toString();
                workerStatListDiv.classList.add('worker-stat-div');
                workerStatContainerDiv.appendChild(workerStatListDiv);
                this.updateDisplayStat()

            }
        }

        //append the gear to the div if it hasnt already
        this.setItemParent()

    }

    remove() {
        //remove resources and items from the worker
        for (let i = 0; i < this.resources.length; i++) {
            this.removeResource(this.resources[i]);
        }
        for (let i = 0; i < this.weapon.length; i++) {
            this.weapon[i].remove()
        }

        //if the container has the div as a child
        if (this.container.contains(this.div)) {
            this.container.removeChild(this.div);
        }
        this.div.remove();


        let index = workers.indexOf(this);
        if (index > -1) {
            workers.splice(index, 1);
        }
    }

    guard(workPower: number) {
        this.activity = 'guarding'
    }

    cook(workPower: number) {
        this.activity = 'cooking'
    }

    farm(workPower: number) {
        this.activity = 'farming'
        //add food to the worker
        let resource = new Resource('food', this.resourceDiv, workPower,)
        this.addResource(resource);
    }

    mine(workPower: number) {
        this.activity = 'mining'
        for (let i = 0; i < workPower; i++) {
            this.mineOnce()
        }


    }

    mineOnce() {
        //have an x chance of getting a resource
        //add a resource to the worker
        let stoneChance = 0.8
        let copperChance = 0.1
        let silverChance = 0.1
        let goldChance = 0.01
        let totalWinChance = stoneChance + copperChance + silverChance + goldChance;
        let random = Math.random() * totalWinChance;

        switch (true) {
            case (random < stoneChance):
                this.addResource(new Resource('stone', this.resourceDiv, 1))
                break;
            case (random < stoneChance + copperChance):
                this.addResource(new Resource('copper', this.resourceDiv, 1))
                break;
            case (random < stoneChance + copperChance + silverChance):
                this.addResource(new Resource('silver', this.resourceDiv, 1))
                break;
            case (random < stoneChance + copperChance + silverChance + goldChance):
                this.addResource(new Resource('gold', this.resourceDiv, 1))
                break;
            default:
                console.log('incorrect chances in mineOnce');
                break;
        }
    }

    merchant(workPower: number) {
        this.activity = 'trading'
    }

    priest(workPower: number) {
        this.activity = 'praying'
    }

    chop(workPower: number) {
        this.activity = 'chopping'
        //add wood to the worker
        this.addResource(new Resource('wood', this.resourceDiv, workPower));
    }

    craft(workPower: number) {
        this.activity = 'crafting'
        craftWork += workPower;
        displayCraftWork()

        updateCraftButton()
    }

    //give energy to all other workers
    nurse(workPower: number) {
        this.activity = 'nursing'
        //todo make workpower do something
        for (let i = 0; i < workers.length; i++) {
            if (workers[i].id != this.id) {
                workers[i].rest();
            }
        }
    }

    gemcut(workPower: number) {
        this.activity = 'gemcutting'
    }

    hunt(workPower: number) {
        this.activity = 'hunting'
        let huntChance = 0.35
        let random = Math.random();
        if (random < huntChance) {
            //add food to the worker
            let resource = new Resource('food', this.resourceDiv, 10 * workPower)
            this.addResource(resource);
        }
        this.addResource(new Resource('food', this.resourceDiv, 0));
    }

    tax(workPower: number) {
        this.activity = 'taxing'
        //get the number of workers who aren't vagrants or taxers
        let workerCount = 0;
        for (let i = 0; i < workers.length; i++) {
            if (workers[i].vocation.name != 'Beggar' && workers[i].vocation.name != 'Taxer') {
                workerCount++;
            }
        }
        let amount = workerCount * workPower;
        if (amount > 0) {
            let resource = new Resource('coins', this.resourceDiv, amount)
            this.addResource(resource);
        }
    }

    gamble(workPower: number) {
        this.activity = 'gambling'
        let winChance = 0.15

        let random = Math.random();
        if (random < winChance) {
            let amount = 0;
            let winChanceBig = 0.01
            let winChanceSmall = 0.15
            let winChanceHuge = 0.001
            // Generate a random number between 0 and the total probability range
            let totalWinChance = winChanceBig + winChanceSmall + winChanceHuge;
            let random = Math.random() * totalWinChance;

            switch (true) {
                case (random < winChanceSmall):
                    amount = 10 * workPower
                    break;
                case (random < winChanceSmall + winChanceBig):
                    amount = 100 * workPower
                    break;
                case (random < winChanceSmall + winChanceBig + winChanceHuge):
                    amount = 1000 * workPower
                    break;
                default:
                    amount = 1
                    console.log('error chances in gambler');
                    break;
            }
            let resource = new Resource('coins', this.resourceDiv, amount)
            this.addResource(resource);
        }

        new Resource('coins', this.resourceDiv, 0)
    }



    research(workPower: number) {
        this.activity = 'researching'
        upgradePoints += workPower;
    }

    beg(workPower: number) {
        this.activity = 'begging'
        if (workPower == 0) {
            workPower = 1;
        }
        let resource: Resource;
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
                    resource = new Resource('coins', this.resourceDiv, workPower)
                    break;
                case (random < chanceCoin + chanceFood):
                    resource = new Resource('food', this.resourceDiv, workPower)
                    break;
                default:
                    console.log('error chances in beg');
                    resource = new Resource('coins', this.resourceDiv, 0)
                    break;


            }
            this.addResource(resource);
        }
        //always add 1 coins and food to show that the worker is begging
        resource = new Resource('coins', this.resourceDiv, 1)
        this.addResource(resource);
        resource = new Resource('food', this.resourceDiv, 0)
        this.addResource(resource);

    }

    export() {
        let exportObject = {
            full: {
                name: this.name,
                energy: this.energy,
                rested: this.rested,
                hunger: this.hunger,
                workProgress: this.workProgress,

            },
            name: this.name,
            vocation: this.vocation.name,
            id: this.id,
            resources: this.resources,
            weapon: this.weapon,
            boot: this.boot,
            energy: this.energy,
            workProgress: this.workProgress,
            hunger: this.hunger,
            mods: this.mods,
            properties: this.properties,
            flags: this.flags,
        }

        return exportObject
    }
}

function getWorkerById(id: number) {
    for (let i = 0; i < workers.length; i++) {
        if (workers[i].id === id) {
            return workers[i];
        }
    }
    return null;
}

