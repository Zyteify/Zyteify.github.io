//create an enum for resource types
type ResourceType = 'food' | 'wood' | 'stone' | 'copper' | 'silver' | 'gold' | 'coins'


class Resource {
    ResourceType: ResourceType;
    amount: number;
    active: boolean = false;

    id: number;

    //display
    imageDirectory: string = "dist/img/resources/";
    imageName: string;
    imageNameBackground: string = "-bg";
    container: HTMLElement;
    div: HTMLElement;
    setup: boolean = false;
    order: number = 0;

    static count: number = 0;
    constructor(name: ResourceType, amount: number, container?: HTMLElement) {
        this.id = Resource.count++;
        this.ResourceType = name;
        this.amount = amount;
        if (container) {
            this.container = container;
        }
        else {

            //no container was passed in, so create a new one but dont use it
            this.container = document.createElement('div');
            this.container.id = "resource" + this.id + 'container';
            this.container.className = "resource-container"
        }

        this.imageName = this.ResourceType + ".png";
        this.div = document.createElement('div');
        this.div.id = "resource" + this.id + 'div';
        this.div.className = "resource-div"
        this.container.appendChild(this.div);

        switch (this.ResourceType) {
            case 'food':
                this.order = 99;
                break;
            case 'wood':
                this.order = 1;
                break;
            case 'stone':
                this.order = 2;
                break;
            case 'copper':
                this.order = 3;
                break;
            case 'silver':
                this.order = 4;
                break;
            case 'gold':
                this.order = 5;
                break;
            case 'coins':
                this.order = 6;
                break;
            default:
                this.order = 7;
                break;
        }

    }

    display() {

        if (!this.setup) {
            this.setup = true;
            //check to see if a div element exists for this resource
            let divImage = document.getElementById("resource" + this.id + 'imagediv')
            if (divImage == null) {
                divImage = document.createElement('div');
                divImage.id = "resource" + this.id + 'imagediv';
                divImage.className = "resource-div-image"
                this.div.appendChild(divImage);
            }

            //check to see if a image element exists for this resource
            let image = <HTMLImageElement>document.getElementById("resource" + this.id + 'image')
            if (image == null) {
                image = document.createElement('img');
                image.src = this.imageDirectory + this.imageName;
                image.id = "resource" + this.id + 'image';
                image.className = "resource-image"
                image.onerror = () => {
                    image.src = "dist/img/fallback-image.png";
                    image.style.height = '20px'
                    image.style.width = '20px'
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
            let paragraph = document.getElementById("resource" + this.id)
            if (paragraph == null) {

                paragraph = document.createElement('p');
                paragraph.id = "resource" + this.id;
                paragraph.className = "resource"

                this.div.appendChild(paragraph);
            }
        }
        let paragraph = document.getElementById("resource" + this.id) as HTMLParagraphElement;
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
            name: this.ResourceType,
            amount: this.amount,
            active: this.active,
        }
        return resource
    }

}

function getResourceByName(name: ResourceType) {
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].ResourceType === name) {
            return resources[i];
        }
    }
    return null;
}
