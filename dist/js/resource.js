"use strict";
//create an enum for resource types
var ResourceType;
(function (ResourceType) {
    ResourceType[ResourceType["food"] = 0] = "food";
    ResourceType[ResourceType["wood"] = 1] = "wood";
})(ResourceType || (ResourceType = {}));
class Resource {
    name;
    amount;
    icon;
    constructor(name, amount, icon) {
        this.name = name;
        this.amount = amount;
        this.icon = icon;
    }
}
function getResourceByName(name) {
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].name === name) {
            return resources[i];
        }
    }
    return null;
}
