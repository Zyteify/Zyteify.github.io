"use strict";
class BaseType {
    id;
    name;
    gearType;
    resourceCost;
    resource;
    implicit;
    value;
    craftingCost;
    itemMod = [];
    static count = 0;
    constructor(name, gearType, resourceCost, resource, itemMods, implicit, value, craftingCost) {
        this.id = BaseType.count++;
        this.name = name;
        this.gearType = gearType;
        this.resourceCost = resourceCost;
        this.resource = resource;
        this.itemMod = itemMods;
        this.implicit = implicit;
        this.value = value;
        this.craftingCost = craftingCost;
    }
    export() {
        let baseType = {
            id: this.id,
            name: this.name,
            gearType: this.gearType,
            resourceCost: this.resourceCost,
            resource: this.resource,
            itemMod: this.itemMod,
            implicit: this.implicit,
            value: this.value,
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
