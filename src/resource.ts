//create an enum for resource types
enum ResourceType {
    food,
    wood,
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
