class Item {
    id: number;
    type: ItemType;
    gear: GearType;
    image: HTMLImageElement;

    //display
    div: HTMLDivElement;
    hoverDiv: HTMLDivElement;
    hoverInsideDiv: HTMLDivElement;
    container: HTMLDivElement;
    baseType: string;
    prefixes: Stat[] = [];
    suffixes: Stat[] = [];
    rarity: RarityType;

    setup: boolean = false;
    setupHover: boolean = false;
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

        //create a hover div
        this.hoverDiv = document.createElement('div');
        this.hoverDiv.id = "hover" + this.id.toString();
        this.hoverDiv.className = "hover";
        this.hoverDiv.style.display = 'none';

        this.hoverInsideDiv = document.createElement('div');
        this.hoverInsideDiv.draggable = false;
        this.hoverInsideDiv.classList.add("item");
        this.hoverInsideDiv.classList.add("item-background");



        //by default make the parent container the crafting window
        this.container = document.getElementById('crafting-item-section') as HTMLDivElement;

        this.setRarityBorder();
        this.setupDiv()
        this.setParentDiv()
        this.setHoverDiv()
    }

    setRarityBorder() {
        switch (this.rarity) {
            case 'Starter':
                this.div.classList.add("item-starter");
                this.hoverInsideDiv.classList.add("item-starter");
                break;
            case 'Common':
                this.div.classList.add("item-common");
                this.hoverInsideDiv.classList.add("item-common");
                break;
            case 'Magic':
                this.div.classList.add("item-magic");
                this.hoverInsideDiv.classList.add("item-magic");
                break;
            case 'Rare':
                this.div.classList.add("item-rare");
                this.hoverInsideDiv.classList.add("item-rare");
                break;
            case 'Unique':
                this.div.classList.add("item-unique");
                this.hoverInsideDiv.classList.add("item-unique");
                break;
            default:
                console.log(`cannot find rarity ${this.rarity}`);
                break;

        }
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

    handleHover(event: MouseEvent) {
        // Position the hoverDiv above the mouse position
        this.hoverDiv.style.display = 'flex';

        const rect = this.div.getBoundingClientRect();

        //how far to set the item to the right. this is the width of the item div divided by 2
        let divWidth = (rect.right - rect.left) / 2
        let extraHeight = 0

        //the item label
        const hoverDivRect = this.hoverInsideDiv.getBoundingClientRect();
        let itemLabelHeight = (hoverDivRect.bottom - hoverDivRect.top);
        let itemLabelWidth = (hoverDivRect.right - hoverDivRect.left);

        let top = rect.top - itemLabelHeight - extraHeight;
        if (top < 0) {
            //set the top to instead be the bottom of the item div
            top = rect.bottom - extraHeight;
        }

        let offsetWidth = divWidth - (itemLabelWidth / 2)

        let left = rect.left + offsetWidth
        if (left < 0) {
            left = 0 + 5
        }
        else if (left + offsetWidth > window.innerWidth) {
            left = window.innerWidth - itemLabelWidth - 5
        }

        this.hoverDiv.style.left = left + 'px';
        this.hoverDiv.style.top = top + 'px';

    }

    handleHoverLeave(event: MouseEvent) {
        // Perform the desired actions when the item is hovered
        this.hoverDiv.style.display = 'none';
    }

    //there is a div that is used when the item is hovered over
    setHoverDiv() {
        if (!this.setupHover) {
            this.setupHover = true;

            //attach the hoverdiv to the hover-container
            const hoverContainer = document.getElementById('hover-container') as HTMLDivElement;
            hoverContainer.appendChild(this.hoverDiv);

            //attach the hoverinside div to the hover div
            this.hoverDiv.appendChild(this.hoverInsideDiv);

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
            this.hoverInsideDiv.appendChild(itemNameDiv);
            this.hoverInsideDiv.appendChild(itemRarityDiv);
            this.hoverInsideDiv.appendChild(itemGearDiv);
            this.hoverInsideDiv.appendChild(itemStatsDiv);

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

    }



    setupDiv() {

        if (!this.setup) {
            this.setup = true;


            //create an item picture div
            const itemPictureDiv = document.createElement('div');
            //set the item picture div class
            itemPictureDiv.classList.add("item-pictureDiv");


            this.div.appendChild(itemPictureDiv);

            if (this.container == craftingItemSectionDiv) {

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