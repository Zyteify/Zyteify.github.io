"use strict";
class Stockpile {
    resources;
    resourcesMax;
    name;
    constructor(resourcesMax, name) {
        this.resources = [];
        this.resourcesMax = resourcesMax;
        this.name = name;
    }
}
