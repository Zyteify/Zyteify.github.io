"use strict";
class Resource {
    name;
    amount;
    active = false;
    id;
    //display
    imageDirectory = "dist/img/resources/";
    imageName;
    imageNameBackground = "-bg";
    container;
    div;
    setup = false;
    static count = 0;
    constructor(name, container, amount) {
        this.id = Resource.count++;
        this.name = name;
        this.amount = amount;
        this.container = container;
        this.imageName = this.name + ".png";
        this.div = document.createElement('div');
        this.div.id = "resource" + this.id + 'div';
        this.div.className = "resource-div";
        this.container.appendChild(this.div);
    }
    display() {
        if (!this.setup) {
            this.setup = true;
            //check to see if a div element exists for this resource
            let divImage = document.getElementById("resource" + this.id + 'imagediv');
            if (divImage == null) {
                divImage = document.createElement('div');
                divImage.id = "resource" + this.id + 'imagediv';
                divImage.className = "resource-div-image";
                this.div.appendChild(divImage);
            }
            //check to see if a image element exists for this resource
            let image = document.getElementById("resource" + this.id + 'image');
            if (image == null) {
                image = document.createElement('img');
                image.src = this.imageDirectory + this.imageName;
                image.id = "resource" + this.id + 'image';
                image.className = "resource-image";
                image.onerror = () => {
                    image.src = "dist/img/fallback-image.png";
                    image.style.height = '20px';
                    image.style.width = '20px';
                };
                divImage.appendChild(image);
            }
            /* //check to see if a image background element exists for this resource
            let imageBackground = <HTMLImageElement>document.getElementById("resource" + this.id + 'imageBackground')
            if (imageBackground == null) {
                imageBackground = document.createElement('img');
                imageBackground.src = this.imageDirectory + this.imageNameBackground;
                imageBackground.id = "resource" + this.id + 'imageBackground';
                imageBackground.className = "resource-image-bg"
                divImage.appendChild(imageBackground);
            } */
            //check to see if a paragraph element exists for this resource
            let paragraph = document.getElementById("resource" + this.id);
            if (paragraph == null) {
                paragraph = document.createElement('p');
                paragraph.id = "resource" + this.id;
                paragraph.className = "resource";
                this.div.appendChild(paragraph);
            }
        }
        let paragraph = document.getElementById("resource" + this.id);
        paragraph.innerHTML = this.amount.toString();
        if (!this.active) {
            this.div.style.display = "none";
        }
        else {
            this.div.style.display = "";
        }
    }
    remove() {
        //remove a resource from its container and list
        this.container.removeChild(this.div);
        this.div.remove();
        let index = resources.indexOf(this);
        if (index > -1) {
            resources.splice(index, 1);
        }
    }
    export() {
        let resource = {
            id: this.id,
            name: this.name,
            amount: this.amount,
            active: this.active,
        };
        return resource;
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
