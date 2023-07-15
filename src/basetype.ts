type BaseTypeName = 'Scrap' | 'Wooden' | 'Copper' | 'Silver' | 'Gold'

class BaseType{
    id: number;
    name: BaseTypeName;
    gearType: GearType
    resourceCost: number []
    resource: ResourceType []
    implicit: string
    value: number
    craftingCost: number
    itemMod: ItemMod[] = []
    static count: number = 0;
    constructor(name: BaseTypeName, gearType: GearType, resourceCost: number[], resource: ResourceType[], itemMods: ItemMod[], implicit: string, value: number, craftingCost: number){
        this.id = BaseType.count++;
        this.name = name
        this.gearType = gearType
        this.resourceCost = resourceCost
        this.resource = resource
        this.itemMod = itemMods
        this.implicit = implicit
        this.value = value
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
            implicit: this.implicit,
            value: this.value,
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