"use strict";
class BaseType {
    id;
    name;
    gearType;
    gearSlot;
    resource;
    craftingCost;
    itemMod = [];
    static count = 0;
    constructor(name, gearType, gearSlot, resource, itemMods, craftingCost) {
        this.id = BaseType.count++;
        this.name = name;
        this.gearType = gearType;
        this.gearSlot = gearSlot;
        this.resource = resource;
        this.itemMod = itemMods;
        this.craftingCost = craftingCost;
    }
    export() {
        let baseType = {
            id: this.id,
            name: this.name,
            gearType: this.gearType,
            resource: this.resource,
            itemMod: this.itemMod,
            craftingCost: this.craftingCost
        };
        return baseType;
    }
}
function findBaseTypeByNameandGearType(name, gearType) {
    for (let i = 0; i < baseTypes.length; i++) {
        if (baseTypes[i].name === name && baseTypes[i].gearType === gearType) {
            return baseTypes[i];
        }
    }
    return null;
}
