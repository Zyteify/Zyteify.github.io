"use strict";
class Gem {
    name;
    id;
    amount;
    active;
    imageDirectory = "dist/img/gems/";
    imageName;
    imageNameBackground = "-bg";
    container;
    div;
    static count = 0;
    constructor(name, imageName, amount, active) {
        this.id = Item.count++;
        this.name = name;
        this.amount = amount;
        this.active = active;
        this.imageName = imageName;
        //add -bg before .png
        this.imageNameBackground = this.imageName.slice(0, this.imageName.length - 4) + this.imageNameBackground + this.imageName.slice(this.imageName.length - 4, this.imageName.length);
        this.container = materialsGemList;
        this.div = document.createElement('div');
    }
    add(amount) {
        this.amount += amount;
    }
    subtract(amount) {
        this.amount -= amount;
    }
    display() {
        //check to see if a div element exists for this resource
        if (this.div.id != "gem" + this.id + 'div') {
            this.div.id = "gem" + this.id + 'div';
            this.div.className = "gem-div";
            this.container.appendChild(this.div);
        }
        //check to see if a div element exists for this resource
        let divImage = document.getElementById("gem" + this.id + 'imagediv');
        if (divImage == null) {
            divImage = document.createElement('div');
            divImage.id = "gem" + this.id + 'imagediv';
            divImage.className = "gem-div-image";
            this.div.appendChild(divImage);
        }
        //check to see if a image element exists for this resource
        let image = document.getElementById("gem" + this.id + 'image');
        if (image == null) {
            image = document.createElement('img');
            image.src = this.imageDirectory + this.imageName;
            image.id = "gem" + this.id + 'image';
            image.className = "gem-image";
            divImage.appendChild(image);
        }
        //check to see if a image background element exists for this resource
        let imageBackground = document.getElementById("gem" + this.id + 'imageBackground');
        if (imageBackground == null) {
            imageBackground = document.createElement('img');
            imageBackground.src = this.imageDirectory + this.imageNameBackground;
            imageBackground.id = "gem" + this.id + 'imageBackground';
            imageBackground.className = "gem-image-bg";
            divImage.appendChild(imageBackground);
        }
        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("gem" + this.id);
        if (paragraph == null) {
            paragraph = document.createElement('p');
            paragraph.id = "gem" + this.id;
            paragraph.className = "gem";
            const container = document.getElementById('materials-list');
            this.div.appendChild(paragraph);
        }
        paragraph.innerHTML = this.amount.toString();
        if (!this.active) {
            this.div.style.display = "none";
        }
        else {
            this.div.style.display = "flex";
        }
    }
    remove() {
        //remove a resource from its container and list
        //if the container has the div as a child
        if (this.container.contains(this.div)) {
            this.container.removeChild(this.div);
        }
        this.div.remove();
        let index = gems.indexOf(this);
        if (index > -1) {
            gems.splice(index, 1);
        }
    }
    export() {
        let gem = {
            id: this.id,
            imageName: this.imageName,
            name: this.name,
            amount: this.amount,
            active: this.active
        };
        return gem;
    }
}
