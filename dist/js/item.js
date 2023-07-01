"use strict";
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
class Item {
    id;
    type;
    gear;
    image;
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
    }
    Display() {
    }
}
