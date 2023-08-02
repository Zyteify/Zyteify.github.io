type BaseMaterial = 'Scrap' | 'Wooden' | 'Copper' | 'Silver' | 'Gold'
type GearType = "Spade" | "Mace" | "Potion" | "Hammer" | "Knife" | "Spear" | "Chisel" | "Quill" | "Dice" | "Scales" | "Holy Symbol" | "Scroll" | "Pickaxe" | "Axe";
type GearSlot = "Weapon" | "Boot" | "Shirt" | "Hat"

const baseMaterials = ['Scrap', 'Wooden', 'Copper', 'Silver', 'Gold']

class BaseType {
    id: number;
    baseMaterial: BaseMaterial;
    gearType: GearType
    gearSlot: GearSlot
    resource: Resource[]
    craftingCost: number
    itemMod: ItemMod[] = []
    unlocked: boolean = false
    static count: number = 0;
    constructor(name: BaseMaterial, gearType: GearType, gearSlot: GearSlot, resource: Resource[], itemMods: ItemMod[], craftingCost: number) {
        this.id = BaseType.count++;
        this.baseMaterial = name
        this.gearType = gearType
        this.gearSlot = gearSlot
        this.resource = resource
        this.itemMod = itemMods
        this.craftingCost = craftingCost
    }

    export() {
        let baseType = {
            id: this.id,
            name: this.baseMaterial,
            gearType: this.gearType,
            resource: this.resource,
            itemMod: this.itemMod,
            craftingCost: this.craftingCost,
            unlocked: this.unlocked
        }
        return baseType
    }

}

function findBaseTypeByNameandGearType(name: BaseMaterial, gearType: GearType) {
    for (let i = 0; i < baseTypes.length; i++) {
        if (baseTypes[i].baseMaterial === name && baseTypes[i].gearType === gearType) {
            return baseTypes[i];
        }
    }
    return null
}

function fundBaseTypeById(id: number) {
    for (let i = 0; i < baseTypes.length; i++) {
        if (baseTypes[i].id === id) {
            return baseTypes[i];
        }
    }
    return null
}