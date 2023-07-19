class Gem {
    name: string;
    id: number;
    amount: number;
    active: boolean;

    //display
    divImage: HTMLDivElement;
    image: HTMLImageElement;
    imageBackground: HTMLImageElement;
    paragraph: HTMLElement;
    imageDirectory: string = "dist/img/gems/";
    imageName: string;
    imageNameBackground: string = "-bg";
    container: HTMLElement;
    div: HTMLDivElement;
    static count: number = 0;
    constructor(name: string, imageName: string, amount: number, active: boolean) {
        this.id = Item.count++;
        this.name = name;
        this.amount = amount;
        this.active = active;

        this.imageName = imageName
        //add -bg before .png
        this.imageNameBackground = this.imageName.slice(0, this.imageName.length - 4) + this.imageNameBackground + this.imageName.slice(this.imageName.length - 4, this.imageName.length)
        this.container = materialsGemList
        this.div = document.createElement('div');

        this.div.id = "gem" + this.id + 'div';
        this.div.className = "gem-div"
        this.container.appendChild(this.div);

        this.divImage = document.createElement('div');
        this.divImage.id = "gem" + this.id + 'imagediv';
        this.divImage.className = "gem-div-image"
        this.div.appendChild(this.divImage);

        this.image = document.createElement('img');
        this.image.src = this.imageDirectory + this.imageName;
        this.image.id = "gem" + this.id + 'image';
        this.image.className = "gem-image"
        this.divImage.appendChild(this.image);

        this.imageBackground = document.createElement('img');
        this.imageBackground.src = this.imageDirectory + this.imageNameBackground;
        this.imageBackground.id = "gem" + this.id + 'imageBackground';
        this.imageBackground.className = "gem-image-bg"
        this.divImage.appendChild(this.imageBackground);


        this.paragraph = document.createElement('p');
        this.paragraph.id = "gem" + this.id;
        this.paragraph.className = "gem"

        this.div.appendChild(this.paragraph);
    }
    add(amount: number) {
        this.amount += amount;
    }
    subtract(amount: number) {
        this.amount -= amount;
    }

    display() {


        this.paragraph.innerHTML = this.amount.toString();

        if (!this.active) {
            this.div.style.display = "none";
        }
        else {
            this.div.style.display = "";
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
        }
        return gem
    }

}

function getGemByName(name: string) {
    for (let i = 0; i < gems.length; i++) {
        if (gems[i].name == name) {
            return gems[i]
        }
    }
}
