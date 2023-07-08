//create an enum for resource types
type ResourceType =  'food' | 'wood' | 'stone' | 'copper' | 'silver'| 'gold' | 'coins'

//resource list
//food - 🍞
//wood - 🌲
//stone - ⛰️
//gems - 💎
//metal - ⚙️
//coins - 💰
//gourmet food - 🍖


const resourceIconMap: Record<ResourceType, string> = {
    'food': "🍞",
    'wood': "🌲",
    'stone': "⛰️",
    'copper': "⚙️",
    'silver': "🥈",
    'gold': "🥇",
    'coins': "💰",
}



class Resource {
    name: ResourceType;
    amount: number;
    icon: string;
    paragraph: HTMLParagraphElement;
    active: boolean = false;

    constructor(name: ResourceType, amount: number) {
        this.name = name;
        this.amount = amount;
        this.icon = resourceIconMap[name];
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
