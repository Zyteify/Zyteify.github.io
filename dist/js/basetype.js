"use strict";
const baseMaterials = ['Scrap', 'Wooden', 'Copper', 'Silver', 'Gold'];
class BaseType {
    id;
    baseMaterial;
    gearType;
    gearSlot;
    resource;
    craftingCost;
    itemMod = [];
    unlocked = false;
    static count = 0;
    constructor(name, gearType, gearSlot, resource, itemMods, craftingCost) {
        this.id = BaseType.count++;
        this.baseMaterial = name;
        this.gearType = gearType;
        this.gearSlot = gearSlot;
        this.resource = resource;
        this.itemMod = itemMods;
        this.craftingCost = craftingCost;
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
        };
        return baseType;
    }
}
function findBaseTypeByNameandGearType(name, gearType) {
    for (let i = 0; i < baseTypes.length; i++) {
        if (baseTypes[i].baseMaterial === name && baseTypes[i].gearType === gearType) {
            return baseTypes[i];
        }
    }
    return null;
}
function fundBaseTypeById(id) {
    for (let i = 0; i < baseTypes.length; i++) {
        if (baseTypes[i].id === id) {
            return baseTypes[i];
        }
    }
    return null;
}
