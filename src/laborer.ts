type classType = 'warrior' | 'farmer' | 'vagrant';


class Vocation {
    name: classType;
    description: string;
    constructor(name: classType, description: string) {
        this.name = name;
        this.description = description;
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

    constructor(name: string) {
        this.id = Laborer.count++;
        this.name = name;
        this.vocation = new Vocation('vagrant', 'farms food');

        this.resources = [];
        this.weapon = null;
        this.boot = null;
    }

    setVocation() {
        if (this.weapon == null) {
            this.vocation = new Vocation('vagrant', 'farms food');
        }
        switch (this.weapon?.gear) {
            case 'sword':
                this.vocation = new Vocation('warrior', 'fights enemies');
                break;
            case 'hoe':
                this.vocation = new Vocation('farmer', 'farms food');
                break;
            default:
                this.vocation = new Vocation('vagrant', 'farms food');
                break;
        }

    }

    doWork() {

        switch (this.vocation.name) {
            case 'warrior':
                points++
                break;
            case 'farmer':
                this.addResource(new Resource(ResourceType.food, 1, '🍞'));
                break;
            default:
                console.log('vagrant');
                break;
        }
    }
    

    //add a resource to the worker
    addResource(resource: Resource) {
        //check to see if the worker already has the resource
        //loop through each resource in the worker's inventory
        for (let i = 0; i < this.resources.length; i++) {
            //check to see if the worker has the resource
            if (this.resources[i].name === resource.name) {
                //add the resource to the worker's inventory
                this.resources[i].amount += resource.amount;
                console.log('adding resource');
                return;
            }else{
                this.resources.push(resource);
                return
            }
            //if the resource does not exist in the worker's inventory, add it            
        }

        //the worker does not have the resource, add it to the worker's inventory
        console.log('adding resource to inventory');
        this.resources.push(resource);


    }

    //remove a resource from the worker
    removeResource(resource: Resource) {
        let index = this.resources.indexOf(resource);
        if (index > -1) {
            this.resources.splice(index, 1);
        }
    }

    //equip an item
    equipItem(item: Item) {
        if (item.type == "weapon") {
            this.weapon = item;
        } else if (item.type == "boot") {
            this.boot = item;
        }
    }

    //unequip an item
    unequipItem(item: Item) {
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

    }


}

