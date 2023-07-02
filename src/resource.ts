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
