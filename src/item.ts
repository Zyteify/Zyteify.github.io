class Item {
    id: number;
    type: string;
    gear: string;
/*     baseName: string;
    prefixName: string;
    suffixName: string;
    rarity: string;
    
    icon: string; */
    static count: number = 0;
    constructor(type: string, gear: string
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