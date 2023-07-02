"use strict";
const itemTypes = ["Weapon", "Boot"];
const gearTypes = [
    "Hoe",
    "Mace",
    "Potion",
    "Hammer",
    "Knife",
    "Bow",
    "Chisel",
    "Quill",
    "Dice",
    "Scales",
    "Holy Symbol",
    "Scroll",
    "Pickaxe",
    "Axe",
];
const vocationMap = {
    'Hoe': 'Farmer',
    'Mace': 'Guard',
    'Potion': 'Nurse',
    'Hammer': 'Builder',
    'Knife': 'Cook',
    'Bow': 'Hunter',
    'Chisel': 'Crafter',
    'Quill': 'Taxer',
    'Dice': 'Gambler',
    'Scales': 'Taxer',
    'Holy Symbol': 'Priest',
    'Scroll': 'Researcher',
    'Pickaxe': 'Miner',
    'Axe': 'Woodcutter',
};
class Item {
    id;
    type;
    gear;
    image;
    //display
    div;
    container;
    paragraph;
    imageElement;
    /*     baseName: string;
        prefixName: string;
        suffixName: string;
        rarity: string;
        
        icon: string; */
    static count = 0;
    constructor(type, gear
    //baseName: string, prefixName: string, suffixName: string, rarity: string, icon: string
    ) {
        this.id = Item.count++;
        this.gear = gear,
            this.type = type;
        this.image = new Image();
        /* this.baseName = baseName;
        this.prefixName = prefixName;
        this.suffixName = suffixName;
        this.rarity = rarity;
        
        this.icon = icon; */
        this.div = document.createElement('div');
        this.div.id = "gear-div" + this.id.toString();
        this.div.className = "gear-div";
        this.div.draggable = true;
        //by default make the parent container the gear list
        this.container = document.getElementById('gear-list');
        this.paragraph = null;
        this.imageElement = new Image();
        this.Display();
    }
    setParagraph() {
        //check to see if a paragraph element exists for this resource
        if (this.paragraph == null) {
            this.paragraph = document.createElement('p');
            this.paragraph.id = "gear" + this.id.toString();
            this.div.appendChild(this.paragraph);
            this.paragraph.innerHTML = this.id + " " + this.type + " " + this.gear;
        }
    }
    setImage() {
        //if the image id has not been set, initialise the image
        if (this.image.id == "") {
            // Set the source attribute of the image
            this.image.src = 'dist/img/' + this.gear + '.png';
            this.image.id = "gear-image" + this.image.id.toString();
            this.image.draggable = false;
            if (this.image.parentElement == null) {
                this.div.appendChild(this.image);
            }
        }
    }
    setParentDiv(parent) {
        this.container = parent;
        this.container.appendChild(this.div);
    }
    Display() {
        //append the div to the gear container if it doesnt belong to any div
        if (this.div.parentElement == null) {
            this.container.appendChild(this.div);
        }
        this.setImage();
        this.setParagraph();
    }
}
