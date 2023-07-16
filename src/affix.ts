
type Affix = {
    affix: PrefixorSuffix;
    name: string;
    modName: ModName;
    valueMin: number;
    valueMax: number;
    tier: number
    stat: string;
    weight: number;
    gearType: string;
    baseType: string;
    itemType: GearSlot;
    rollable: boolean;
    modFamily: string;
    tags: string;
}

//return a single affix using the weights of the affix list
function getAffix(affixList: Affix[], statlist: Explicit[]): Affix{

    //get mod families from the statlist that should be forbidden
    let forbiddenModFamilies: string[] = [];
    for(let i = 0; i < statlist.length; i++){
        if(statlist[i].modFamily != ""){
            forbiddenModFamilies.push(statlist[i].modFamily);
        }
    }

    //filter the affixlist to remove affixes that have a forbidden mod family
    affixList = affixList.filter(affix => !forbiddenModFamilies.includes(affix.modFamily));

    //get the total weight of the affixes
    let totalWeight = 0;
    for(let i = 0; i < affixList.length; i++){
        totalWeight += affixList[i].weight;
    }

    //get a random number between 0 and the total weight
    let randomNumber = Math.random() * totalWeight;

    //go through the affix list and subtract the weight from the random number
    //if the random number is less than 0, then that is the affix to return
    for(let i = 0; i < affixList.length; i++){
        randomNumber -= affixList[i].weight;
        if(randomNumber <= 0){
            return affixList[i];
        }
    }
    //console log a red result if the affix is not found
    console.log("%cAffix not found", "color: red");
    return affixList[0];

}
