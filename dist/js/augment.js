"use strict";
class AugmentButton {
    id = 0;
    name = "";
    active = true;
    div;
    button;
    costDiv;
    setup = false;
    gems = [];
    craftingCost = 0;
    static count = 0;
    constructor(name, gems, craftingCost) {
        this.id = CraftingButton.count++;
        this.name = name;
        this.gems = gems;
        this.craftingCost = craftingCost;
        this.div = document.createElement('div');
        this.div.id = `crafting-div-${this.id}`;
        this.div.className = "crafting-div";
        craftingOptionsDiv.appendChild(this.div);
        this.button = document.createElement('button');
        this.button.id = `crafting-button-${this.id}`;
        this.button.className = "crafting-button";
        this.button.onclick = () => {
            this.click();
        };
        this.costDiv = document.createElement('div');
        this.costDiv.id = `crafting-cost-div-${this.id}`;
        this.costDiv.className = "crafting-cost-div";
        this.button.appendChild(this.costDiv);
        this.div.appendChild(this.button);
        this.display();
    }
    isActive() {
        return this.active;
    }
    click() {
        console.log("clicked");
    }
    //set the button to inactive or not and also hide it if it is not active
    display() {
        if (!this.isActive()) {
            this.div.classList.add("hide");
        }
        else {
            this.div.classList.remove("hide");
        }
        //if the costDiv has no children, add them
        if (!this.setup) {
            this.addCostDivChildren();
        }
    }
    addCostDivChildren() {
        this.setup = true;
        //update the paragraph
        let initialParagraph = document.createElement('p');
        initialParagraph.id = `crafting-paragraph-${this.id}`;
        initialParagraph.className = `crafting-paragraph-initial`;
        initialParagraph.innerHTML = `${this.name}`;
        this.costDiv.appendChild(initialParagraph);
        if (this.gems.length > 0) {
            for (let i = 0; i < this.gems.length; i++) {
                /* this.resources[i].container = this.costDiv; */
                //actually set the display to be here
                this.gems[i].active = true;
                //remove the resource from the costDiv and add it back in
                this.gems[i].container.removeChild(this.gems[i].div);
                this.costDiv.appendChild(this.gems[i].div);
                this.gems[i].display();
            }
        }
        if (this.craftingCost > 0) {
            //create a paragraph for the crafting cost
            let craftingCostParagraph = document.createElement('p');
            craftingCostParagraph.id = `crafting-cost-paragraph-${this.id}`;
            craftingCostParagraph.className = `crafting-cost-paragraph`;
            craftingCostParagraph.innerHTML = `🔨 ${this.craftingCost.toString()}`;
            this.costDiv.appendChild(craftingCostParagraph);
        }
    }
}
