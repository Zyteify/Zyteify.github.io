class Gem {
    name: string;
    id: number;
    amount: number;
    active: boolean;
    imageDirectory: string = "dist/img/gems/";
    imageName: string;
    imageNameBackground: string = "-bg";
    container: HTMLDivElement;
    static count: number = 0;
    constructor(name: string, imageName: number, container: HTMLDivElement, amount: number, active: boolean) {
        this.id = Item.count++;
        this.name = name;
        this.amount = amount;
        this.active = active;
        this.container = container;

        this.imageName = "gem" + imageName + ".png";
        this.imageNameBackground = "gem" + imageName + this.imageNameBackground + ".png";
    }
    add(amount: number) {
        this.amount += amount;
    }
    subtract(amount: number) {
        this.amount -= amount;
    }

    display() {

        //check to see if a div element exists for this resource
        let div = document.getElementById("gem" + this.id + 'div')
        if (div == null) {
            div = document.createElement('div');
            div.id = "gem" + this.id + 'div';
            div.className = "gem-div"
            this.container.appendChild(div);
        }

        //check to see if a div element exists for this resource
        let divImage = document.getElementById("gem" + this.id + 'imagediv')
        if (divImage == null) {
            divImage = document.createElement('div');
            divImage.id = "gem" + this.id + 'imagediv';
            divImage.className = "gem-div-image"
            div.appendChild(divImage);
        }

        //check to see if a image element exists for this resource
        let image = <HTMLImageElement>document.getElementById("gem" + this.id + 'image')
        if (image == null) {
            image = document.createElement('img');
            image.src = this.imageDirectory + this.imageName;
            image.id = "gem" + this.id + 'image';
            image.className = "gem-image"
            divImage.appendChild(image);
        }

        //check to see if a image background element exists for this resource
        let imageBackground = <HTMLImageElement>document.getElementById("gem" + this.id + 'imageBackground')
        if (imageBackground == null) {
            imageBackground = document.createElement('img');
            imageBackground.src = this.imageDirectory + this.imageNameBackground;
            imageBackground.id = "gem" + this.id + 'imageBackground';
            imageBackground.className = "gem-image-bg"
            divImage.appendChild(imageBackground);
        }

        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("gem" + this.id)
        if (paragraph == null) {

            paragraph = document.createElement('p');
            paragraph.id = "gem" + this.id;
            paragraph.className = "gem"

            const container = document.getElementById('materials-list') as HTMLDivElement;
            div.appendChild(paragraph);
        }

        paragraph.innerHTML = this.amount.toString();

        if (!this.active) {
            div.style.display = "none";
        }
        else {
            div.style.display = "flex";
        }

    }

}