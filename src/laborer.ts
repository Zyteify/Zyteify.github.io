/* Jobs

farmer - consistent food gathering - hoe
transporter - speedup moving peons around
Guard - stop thieves - mace
nurse - restore energy of peons - potion
builder - creates buildings - hammer
Cook - upgrades food - knife
hunter - risky food gathering - bow
Crafter - improves gear crafting - chisel
 taxer - generates income from peons - quill
 gambler - improves odds - dice
merchant - sell extra resources. Buys resources - scale
priest - unlock upgrades - holy symbol
Researcher - generate exp - scroll
Miner - generates stone - pickaxe
Woodcutter - generates wood - axe
 */
type classType = "Vagrant" | 'Farmer' | 'Transporter' | 'Guard' | 'Nurse' | 'Builder' | 'Cook' | 'Hunter' | 'Crafter' | 'Taxer' | 'Gambler' | 'Merchant' | 'Priest' | 'Researcher' | 'Miner' | 'Woodcutter';


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
    static names: string[] = [];

    resources: Resource[] = [];
    //empty array of items
    weapon: Item | null;
    boot: Item | null;
    image: HTMLImageElement;


    //display
    div: HTMLDivElement;
    container: HTMLDivElement;
    paragraph: HTMLParagraphElement | null;

    constructor(name: string) {
        this.id = Laborer.count++;
        this.name = name;
        this.vocation = new Vocation('Vagrant', 'farms food');

        this.resources = [];
        this.weapon = null;
        this.boot = null;

        //div
        this.div = document.createElement('div');
        this.div.id = "worker-div" + this.id.toString();
        this.div.className = "worker-div";

        //image
        this.image = new Image();
        //container
        this.container = document.getElementById('worker-list') as HTMLDivElement;
        //paragraph
        this.paragraph = null;

        this.setName()
    }

    randomiseName() {
        if (nameList.length == 0) {
            return this.id.toString();
        } else {
            // Pick a random name
            const randomIndex = Math.floor(Math.random() * nameList.length);
            const name = nameList[randomIndex];
            console.log(name);
            //remove the name from the list
            nameList.splice(randomIndex, 1);
            return name
        }

        return 'error';
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
            this.vocation = new Vocation('Vagrant', 'farms food');
        }
        switch (this.weapon?.gear) {
            case 'Axe':
                this.vocation = new Vocation('Woodcutter', 'fights enemies');
                break;
            case 'Hoe':
                this.vocation = new Vocation('Farmer', 'farms food');
                break;
            default:
                this.vocation = new Vocation('Vagrant', 'farms food');
                break;
        }

    }

    doWork() {

        switch (this.vocation.name) {
            case 'Woodcutter':
                this.addResource(new Resource(ResourceType.wood, 1, '🌲'));
                break;
            case 'Farmer':
                this.addResource(new Resource(ResourceType.food, 1, '🍞'));
                break;
            case 'Vagrant':

                break;
            default:
                console.log('no work found for ' + this.vocation.name);
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
            } else {
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
        //check to see if a paragraph element exists for this resource
        if (this.paragraph == null) {
            this.paragraph = document.createElement('p');
            this.paragraph.id = "worker" + this.id.toString();


            this.div.appendChild(this.paragraph);
        } else {
            this.paragraph.innerHTML = this.id + " " + this.name + ": " + this.vocation.name;
        }


    }

    setWorkerGearImage() {
        //display the worker's gear
        let myWeapon = <Item>this.weapon
        if (myWeapon != null) {
            let gearImage = <HTMLImageElement>document.getElementById("gear-image" + myWeapon.gear.toString())
            if (gearImage == null) {
                gearImage = document.createElement('img');
                // Set the source attribute of the image


                gearImage.src = 'dist/img/' + myWeapon.gear + '.png';
                gearImage.id = "gear-image" + myWeapon.gear.toString();

                gearImage.draggable = false


                this.div.appendChild(gearImage);
            }
        }
        if (this.boot != null) {
        }
    }

    setResourceDisplay() {
        //check to see if a paragraph element exists for this resource
        if (this.paragraph == null) {
            this.setParagraph();
        }
        if (this.paragraph != null) {

            for (let i = 0; i < this.resources.length; i++) {
                this.paragraph.innerHTML += " " + this.resources[i].icon + " " + this.resources[i].amount;
            }
        }
    }

    Display() {

        //append the div to the container if it hasnt already
        if (this.div.parentElement == null) {
            this.container.appendChild(this.div);
        }

        this.setParagraph()

        this.setImage()

        this.setWorkerGearImage()

        this.setResourceDisplay()
    }
}
