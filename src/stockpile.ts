class Stockpile {
    resources:Resource[];
    resourcesMax:Resource[];
    name:string;
    
    constructor(resourcesMax:Resource[], name:string) {
        this.resources = [];
        this.resourcesMax = resourcesMax;
        this.name = name;
    }
}