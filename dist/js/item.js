"use strict";
class Item {
    id;
    type;
    gear;
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
        /* this.baseName = baseName;
        this.prefixName = prefixName;
        this.suffixName = suffixName;
        this.rarity = rarity;
        
        this.icon = icon; */
    }
}
