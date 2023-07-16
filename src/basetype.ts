type BaseTypeName = 'Scrap' | 'Wooden' | 'Copper' | 'Silver' | 'Gold'
type GearType = "Spade" | "Mace" | "Potion" | "Hammer" | "Knife" | "Spear" | "Chisel" | "Quill" | "Dice" | "Scales" | "Holy Symbol" | "Scroll" | "Pickaxe" | "Axe";
type GearSlot = "Weapon" | "Boot" | "Shirt" | "Hat"

class BaseType{
    id: number;
    name: BaseTypeName;
    gearType: GearType
    gearSlot: GearSlot
    resourceCost: number []
    resource: ResourceType []
    craftingCost: number
    itemMod: ItemMod[] = []
    static count: number = 0;
    constructor(name: BaseTypeName, gearType: GearType, gearSlot: GearSlot, resourceCost: number[], resource: ResourceType[], itemMods: ItemMod[], craftingCost: number){
        this.id = BaseType.count++;
        this.name = name
        this.gearType = gearType
        this.gearSlot = gearSlot
        this.resourceCost = resourceCost
        this.resource = resource
        this.itemMod = itemMods
        this.craftingCost = craftingCost
    }

    export (){
        let baseType = {
            id: this.id,
            name: this.name,
            gearType: this.gearType,
            resourceCost: this.resourceCost,
            resource: this.resource,
            itemMod: this.itemMod,
            craftingCost: this.craftingCost
        }
        return baseType
    }

}

function findBaseTypeByNameandGearType(name: BaseTypeName, gearType: GearType){
    for (let i = 0; i < baseTypes.length; i++) {
        if (baseTypes[i].name === name && baseTypes[i].gearType === gearType) {
            return baseTypes[i];
        }
    }
    return null
}