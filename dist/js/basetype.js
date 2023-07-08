"use strict";
class BaseType {
    id;
    name;
    gearType;
    resourceCost;
    resource;
    itemPower;
    implicit;
    value;
    craftingCost;
    static count = 0;
    constructor(name, gearType, resourceCost, resource, itemPower, implicit, value, craftingCost) {
        this.id = BaseType.count++;
        this.name = name;
        this.gearType = gearType;
        this.resourceCost = resourceCost;
        this.resource = resource;
        this.itemPower = itemPower;
        this.implicit = implicit;
        this.value = value;
        this.craftingCost = craftingCost;
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
