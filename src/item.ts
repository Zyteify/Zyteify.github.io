class Item {
    id: number;
    type: ItemType;
    gear: GearType;
    image: HTMLImageElement;

    //display
    div: HTMLDivElement;
    shortDiv: HTMLDivElement;
    container: HTMLDivElement;
    baseType: string;
    prefixes: Stat[] = [];
    suffixes: Stat[] = [];
    rarity: RarityType;

    setup: boolean = false;
    setupShort: boolean = false;
    static count: number = 0;
    constructor(type: ItemType, gear?: GearType,
        baseType?: string, rarity?: RarityType
    ) {
        this.id = Item.count++;
        this.type = type;
        if (!gear) {
            gear = generateGear();
        }
        this.gear = gear;

        if (!baseType) {
            baseType = generateBaseType();
        }
        this.baseType = baseType;

        if (!rarity) {
            rarity = generateRarity();
        }
        this.rarity = rarity;

        //generate the affixes
        let affixes = generateAffixes(this.rarity, this.gear);
        for (let i = 0; i < affixes.length; i++) {
            if (affixes[i].affix == "Prefix") {
                this.prefixes.push(affixes[i]);
            }
            else if (affixes[i].affix == "Suffix") {
                this.suffixes.push(affixes[i]);
            }
        }



        this.image = new Image();
        //create an item div
        this.div = document.createElement('div');

        //set the item div class

        this.div.id = "gear-div" + this.id.toString();
        this.div.className = "gear-div";
        this.div.draggable = true;
        this.div.classList.add("item");

        //create a short item div
        this.shortDiv = document.createElement('div');



        //by default make the parent container the crafting window
        this.container = document.getElementById('crafting-item-section') as HTMLDivElement;

        this.setupDiv()
        this.setParentDiv()
    }



    setParentDiv(parent?: HTMLDivElement) {

        //remove the div from the current parent

        if (this.div.parentElement != null) {
            this.div.parentElement.removeChild(this.div);
        }
        if (parent == null) {
            parent = gearListContainer
        }
        this.container = parent;

        this.container.appendChild(this.div);

    }

    resetDiv() {
        //destory the div and resetup div
        removeAllChildren(this.div);
        this.setup = false
        this.setupDiv();
    }

    delete() {
        //if the container has the div as a child
        if (this.container.contains(this.div)) {
            this.container.removeChild(this.div);
        }
        deletedItems.push(this);
        //remove event listeners


    }



    setupDiv() {

        if (!this.setup) {
            this.setup = true;







            //create an item picture div
            const itemPictureDiv = document.createElement('div');
            //set the item picture div class
            itemPictureDiv.classList.add("item-pictureDiv");


            this.div.appendChild(itemPictureDiv);

            if (showFullItems || this.container == craftingItemSectionDiv) {

                //create an item name div
                const itemNameDiv = document.createElement('div');
                //set the item name div class
                itemNameDiv.classList.add("item-nameDiv");
                //create an item gear div
                const itemGearDiv = document.createElement('div');
                //set the item gear div class
                itemGearDiv.classList.add("item-gearDiv");
                //create an item stats div
                const itemStatsDiv = document.createElement('div');
                //set the item stats div class
                itemStatsDiv.classList.add("item-statsDiv");
                //create an item rarity div
                const itemRarityDiv = document.createElement('div');
                //set the item rarity div class
                itemRarityDiv.classList.add("item-rarityDiv");

                //append the divs to the item div
                this.div.appendChild(itemNameDiv);
                this.div.appendChild(itemRarityDiv);
                this.div.appendChild(itemGearDiv);
                this.div.appendChild(itemStatsDiv);

                //set the item rarity
                let itemRarity = document.createElement('p');
                itemRarity.classList.add("item-rarity");
                itemRarity.classList.add("small-margin");
                itemRarity.innerHTML = `${this.rarity}`;
                itemRarityDiv.appendChild(itemRarity);

                //set the item gear
                let itemGear = document.createElement('p');
                itemGear.classList.add("item-gear");
                itemGear.classList.add("small-margin");
                itemGear.innerHTML = `${this.gear}`;
                itemGearDiv.appendChild(itemGear);

                let itemStat = [];
                let itemStatDiv = [];
                let itemStatAffix = [];


                //for each stat
                let numAffixes = this.prefixes.length + this.suffixes.length;
                for (let i = 0; i < numAffixes; i++) {

                    let affix;
                    let affixText = "";
                    //if looking at a prefix
                    if (i < this.prefixes.length) {
                        affix = this.prefixes[i];
                        affixText = "P";
                    }
                    //if looking at a suffix
                    else {
                        affix = this.suffixes[i - this.prefixes.length];
                        affixText = "S";
                    }

                    //create a div for the stat
                    let statDiv = document.createElement('div');
                    statDiv.classList.add("item-statDiv");
                    statDiv.classList.add("small-margin");
                    itemStatDiv.push(statDiv);

                    //set the item stats
                    let statAffix = document.createElement('p');
                    statAffix.classList.add("item-stat-affix");
                    statAffix.classList.add("small-margin");
                    //add a newline between tier and name
                    statAffix.innerHTML = `(${affixText}${affix.tier})<br>(${affix.name})`
                    statAffix.dataset.stat = affix.tags;
                    statAffix.dataset.affix = `${affix.affix}`;
                    itemStatAffix.push(statAffix);
                    ;

                    let stat = document.createElement('p');
                    stat.classList.add("item-stat");
                    stat.classList.add("small-margin");
                    stat.innerHTML = `${affix.value} ${affix.stat}`;
                    stat.dataset.stat = affix.tags;
                    stat.dataset.affix = `${affix.affix}`;
                    itemStat.push(stat);

                }


                for (let i = 0; i < itemStat.length; i++) {
                    itemStatDiv[i].appendChild(itemStatAffix[i]);
                    itemStatDiv[i].appendChild(itemStat[i]);

                }

                for (let i = 0; i < itemStatDiv.length; i++) {
                    itemStatsDiv.appendChild(itemStatDiv[i]);
                }

                let itemName = document.createElement('p');
                itemName.classList.add("item-name");
                itemName.innerHTML = `${this.rarity} ${this.baseType} ${this.gear}`;
                itemNameDiv.appendChild(itemName);

            }



            //set the item picture
            let itemPicture = document.createElement('img');
            itemPicture.classList.add("item-picture");
            let itempicture = this.gear.toLocaleLowerCase();
            itemPicture.src = `../dist/img/${itempicture}.png`;
            itemPicture.draggable = false;
            itemPictureDiv.appendChild(itemPicture);







        }
    }


}