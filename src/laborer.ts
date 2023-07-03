type ClassType = "Beggar" | 'Farmer' | 'Guard' | 'Nurse' | 'Builder' | 'Cook' | 'Hunter' | 'Crafter' | 'Taxer' | 'Gambler' | 'Merchant' | 'Priest' | 'Researcher' | 'Miner' | 'Woodcutter';

class Vocation {
    name: ClassType;

    constructor(name: ClassType) {
        this.name = name;


    }
}
//create the class worker
class Laborer {
    name: string;
    vocation: Vocation;
    id: number;
    static count: number = 0;

    resources: Resource[] = [];
    //empty array of items
    weapon: Item | null;
    boot: Item | null;
    image: HTMLImageElement;


    //display
    div: HTMLDivElement;
    container: HTMLDivElement;
    paragraph: HTMLParagraphElement[];
    paragraphDiv: HTMLDivElement;
    resourcesParagraphs: HTMLParagraphElement[];
    resourceDiv: HTMLDivElement;
    gearDiv: HTMLDivElement;

    //actions
    vocationActions: Record<ClassType, () => void>; // Mapping of vocation to function

    workSpeed: number = 10;
    static workSpeedDefault: number = 10;
    hunger: number = 0;
    workSpeedMin: number = 1;
    workProgress: number = 0;

    constructor(name?: string) {
        this.id = Laborer.count++;
        this.name = 'temp';
        this.vocation = new Vocation('Beggar');

        this.resources = [];
        this.weapon = null;
        this.boot = null;

        //actions
        this.vocationActions = {
            Beggar: this.beg,
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
        this.container = document.getElementById('worker-list') as HTMLDivElement;
        //paragraph
        this.paragraph = []
        this.resourcesParagraphs = [];
        this.paragraphDiv = document.createElement('div');
        this.paragraphDiv.id = "worker-paragraph-div" + this.id.toString();
        this.resourceDiv = document.createElement('div');
        this.resourceDiv.id = "worker-resources-div" + this.id.toString();

        this.gearDiv = document.createElement('div');
        this.gearDiv.id = "worker-gear-div" + this.id.toString();

        this.setName(name)
        this.setupDiv()

    }

    randomiseName() {
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
        if (this.weapon == null) {
            this.vocation = new Vocation('Beggar');
        }
        let gearType: GearType = <GearType>this.weapon?.gear;
        if (vocationMap.hasOwnProperty(gearType)) {
            this.vocation.name = vocationMap[gearType];
            console.log(`Laborer's vocation changed to ${this.vocation.name}`);
        } else {
            console.log(`The item "${gearType}" does not have a corresponding vocation.`);
        }

        //update text
        this.setParagraph()

        //when they change vocation, they should lose their work progress
        this.workProgress = 0;

    }

    doWork() {
        this.workProgress += this.workSpeed;
        if (this.workProgress >= 100) {
            this.workProgress -= 100;
            this.vocationActions[this.vocation.name].call(this);
            this.workSpeed -= 1
            this.hunger += 1
            


        }

        


        this.setParagraph()
    }


    //add a resource to the worker
    addResource(resource: Resource) {
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
    removeResource(resource: Resource) {
        resource.paragraph.id = "";

        resource.paragraph.remove();

        let index = this.resources.indexOf(resource);
        if (index > -1) {
            this.resources.splice(index, 1);
        }
    }

    //equip an item
    equipItem(item: Item) {
        if (item.type == "Weapon") {
            this.weapon = item;
        } else if (item.type == "Boot") {
            this.boot = item;
        }
        this.setItemParent();
        this.setVocation();
    }

    //unequip an item
    unequipItem(item: Item) {
        switch (item.type) {
            case "Weapon":
                this.weapon = null;
                break;
            case "Boot":
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


    depositResources(amount: number) {
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
            } else {
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

    //consume food to do get the work speed back to normal
    eat() {
        
        let food = getResourceByName(ResourceType.food);

        if (food != null && food.amount > 0 && this.workSpeed < Laborer.workSpeedDefault) {
            food.amount -= 1;
            this.workSpeed += 1;
            this.hunger -= 1;
            this.setParagraph()
        }
    }

    setImage() {
        //if the image id has not been set, initialise the image
        if (this.image.id == "") {
            // Set the source attribute of the image
            this.image.src = 'dist/img/person.png';
            this.image.id = "worker-image" + this.id.toString();
            this.image.draggable = false
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
                    this.paragraph[i].innerHTML = this.name + ": " + this.vocation.name
                    break;
                case (1):
                    this.paragraph[i].innerHTML = "Work Progress: " + this.workProgress.toString()
                    break;
                case (2):
                    this.paragraph[i].innerHTML = "Work Speed: " + this.workSpeed.toString()
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
        //check to see if a paragraph element exists for each resource and create it if neccessary
        for (let i = 0; i < this.resources.length; i++) {
            if (this.resources[i].paragraph.id == "") {
                this.resources[i].paragraph.id = "workerResources" + this.resources[i].name;
                this.resourceDiv.appendChild(this.resources[i].paragraph);
                this.resources[i].paragraph.innerHTML = `${this.resources[i].icon} ${this.resources[i].amount}`;
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
        this.setParagraph()

        //append the image to the div if it hasnt already
        this.setImage()

        //append the gear to the div if it hasnt already
        this.setItemParent()

        //append the resources to the div if they havent already
        this.setResourcesDisplay()
    }


    farm() {
        //add food to the worker
        let resource = new Resource(ResourceType.food, 2)
        this.addResource(resource);
        console.log('farming');
    }

    mine() {
        console.log('mining');
        //have an x chance of getting a resource
        //add a resource to the worker
        let stoneChance = 0.8
        let gemsChance = 0.1
        let metalChance = 0.1
        let random = Math.random();

        switch (true) {
            case (random < stoneChance):
                this.addResource(new Resource(ResourceType.stone, 1))
                break;
            case (random < stoneChance + gemsChance):
                this.addResource(new Resource(ResourceType.gems, 1))
                break;
            case (random < stoneChance + gemsChance + metalChance):
                this.addResource(new Resource(ResourceType.metal, 1))
                break;
            default:
                console.log('failed to mine');
                break;

        }

    }

    chop() {
        //add wood to the worker
        this.addResource(new Resource(ResourceType.wood, 1));
    }

    craft() {
        craftProgress += 1;
        craftItem();
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
        let huntChance = 0.35
        let random = Math.random();
        if (random < huntChance) {
            //add food to the worker
            let resource = new Resource(ResourceType.food, 10)
            this.addResource(resource);
        }
        this.addResource(new Resource(ResourceType.food, 0));
    }

    tax() {
        //get the number of workers who aren't vagrants or taxers
        let workerCount = 0;
        for (let i = 0; i < workers.length; i++) {
            if (workers[i].vocation.name != 'Beggar' && workers[i].vocation.name != 'Taxer') {
                workerCount++;
            }
        }
        let amount = workerCount * 2;
        if (amount > 0) {
            let resource = new Resource(ResourceType.coins, amount)
            this.addResource(resource);
        }

        //the taxer can instantly deposit the resources
        this.depositResources(10)
        console.log('taxing');
    }

    gamble() {
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
                    amount = 10
                    break;
                case (random < winChanceSmall + winChanceBig):
                    amount = 100
                    break;
                case (random < winChanceSmall + winChanceBig + winChanceHuge):
                    amount = 1000
                    break;
                default:
                    amount = 1
                    console.log('error chances in gambler');
                    break;
            }
            let resource = new Resource(ResourceType.coins, amount)
            this.addResource(resource);
        }

        new Resource(ResourceType.coins, 0)
    }

    merchant() {
        console.log('merchandising');
    }

    priest() {
        console.log('preaching');
    }

    research() {
        upgradePoints += 1;
        console.log('researching');
    }

    beg() {
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
                    resource = new Resource(ResourceType.coins, amount)
                    break;
                case (random < chanceCoin + chanceFood):
                    resource = new Resource(ResourceType.food, amount)
                    break;
                default:
                    console.log('error chances in beg');
                    resource = new Resource(ResourceType.coins, 0)
                    break;


            }
            this.addResource(resource);
        }
        //always add 0 coinds and food to show that the worker is begging
        resource = new Resource(ResourceType.coins, 0)
        this.addResource(resource);
        resource = new Resource(ResourceType.food, 0)
        this.addResource(resource);

    }
}