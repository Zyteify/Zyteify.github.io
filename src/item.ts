type GearType = "Hoe" | "Mace" | "Potion" | "Hammer" | "Knife" | "Bow" | "Chisel" | "Quill" | "Dice" | "Scales" | "Holy Symbol" | "Scroll" | "Pickaxe" | "Axe";

const gearTypes: GearType[] = [
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
    id: number;
    type: string;
    gear: GearType;
    image: HTMLImageElement;
/*     baseName: string;
    prefixName: string;
    suffixName: string;
    rarity: string;
    
    icon: string; */
    static count: number = 0;
    constructor(type: string, gear: GearType
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