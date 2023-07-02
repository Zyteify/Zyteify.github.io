"use strict";
//create an enum for resource types
var ResourceType;
(function (ResourceType) {
    ResourceType[ResourceType["food"] = 0] = "food";
    ResourceType[ResourceType["wood"] = 1] = "wood";
    ResourceType[ResourceType["stone"] = 2] = "stone";
    ResourceType[ResourceType["gems"] = 3] = "gems";
    ResourceType[ResourceType["metal"] = 4] = "metal";
    ResourceType[ResourceType["coins"] = 5] = "coins";
})(ResourceType || (ResourceType = {}));
class Resource {
    name;
    amount;
    icon;
    paragraph;
    constructor(name, amount, icon) {
        this.name = name;
        this.amount = amount;
        this.icon = icon;
        this.paragraph = document.createElement('p');
        this.paragraph.innerText = this.icon + " " + this.name + ": " + this.amount;
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
