//create an enum for resource types
enum ResourceType {
    food,
    wood,
    stone,
    gems,  
    metal,
    coins
}



class Resource {
    name: ResourceType;
    amount: number;
    icon: string;
    paragraph: HTMLParagraphElement;
    
    constructor(name: ResourceType, amount: number, icon: string) {
        this.name = name;
        this.amount = amount;
        this.icon = icon;
        this.paragraph = document.createElement('p');
        this.paragraph.innerText = this.icon + " " + this.name + ": " + this.amount;
    }
}



function getResourceByName(name: ResourceType) {
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].name === name) {
            return resources[i];
        }
    }
    return null;
}


let emptyResourceList: Resource[] = [
    new Resource(ResourceType.food, 0, "🍞"),
    new Resource(ResourceType.wood, 0, "🌲"),
    new Resource(ResourceType.stone, 0, "⛰️"),
    new Resource(ResourceType.gems, 0, "💎"),
    new Resource(ResourceType.metal, 0, "⛏️"),
    new Resource(ResourceType.coins, 0, "💰"),
]

function getEmptyResourceByName(name: ResourceType): Resource {
    for (let i = 0; i < emptyResourceList.length; i++) {
        if (emptyResourceList[i].name === name) {
            return emptyResourceList[i];
        }
    }
    return new Resource(ResourceType.coins, 0, "💰")
}