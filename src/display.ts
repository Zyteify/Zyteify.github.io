function displayText() {
    //game-time
    days.innerHTML = game.days.toString();
    hours.innerHTML = game.hours.toString();
    minutes.innerHTML = game.minutes.toString();
    //game-time-speed
    time_multiplier.innerHTML = game.time_multiplier.toString();
    //workers
    //worker-count-current
    workerCountCurrent.innerHTML = game.workerCountCurrent.toString();
    //worker-count-max
    workerCountMax.innerHTML = game.workerCountMax.toString();
    //gear
    //gear-count-current
    gearCountCurrent.innerHTML = game.gearCountCurrent.toString();
    //gear-count-max
    gearCountMax.innerHTML = game.gearCountMax.toString();


    displayWorkers()
    displayResources()
    displayGear()
}

//create a list text to display the workers
function displayWorkers() {
    const container = document.getElementById('worker-list') as HTMLDivElement;
    //loop through each worker and create a paragraph element for them if it doesn't exist
    for (let i = 0; i < workers.length; i++) {
        //loop through each worker
        workers[i].Display()
    }

    updateEventListeners()

}

function emptyGearDisplay() {
    const container = document.getElementById('gear-list') as HTMLDivElement;
    container.innerHTML = "";
}

function displayGear() {
    const container = document.getElementById('gear-list') as HTMLDivElement;
    //loop through each resource and create a paragraph element for them if it doesn't exist
    for (let i = 0; i < items.length; i++) {

        let div = document.getElementById("gear-div" + items[i].id.toString())
        if (div == null) {

            div = document.createElement('div');
            div.id = "gear-div" + items[i].id.toString();
            //set the class to worker-div
            div.className = "gear-div";
            //allow the div to be draggable
            div.draggable = true;


            container.appendChild(div);
        }

        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("gear" + items[i].id.toString())
        if (paragraph == null) {

            paragraph = document.createElement('p');
            paragraph.id = "gear" + items[i].id.toString();


            div.appendChild(paragraph);
        }
        paragraph.innerHTML = items[i].id + " " + items[i].type + " " + items[i].gear

        let image = <HTMLImageElement>document.getElementById("gear-image" + items[i].id.toString())
        if (image == null) {
            image = document.createElement('img');
            // Set the source attribute of the image


            image.src = 'dist/img/' + items[i].gear + '.png';
            image.id = "gear-image" + items[i].id.toString();

            image.draggable = false


            div.appendChild(image);
        }


    }
}

function displayResources() {

    //loop through each resource and create a paragraph element for them if it doesn't exist
    for (let i = 0; i < resources.length; i++) {
        //check to see if a paragraph element exists for this resource
        let paragraph = document.getElementById("resource" + resources[i].name)
        if (paragraph == null) {

            paragraph = document.createElement('p');
            paragraph.id = "resource" + resources[i].name;

            const container = document.getElementById('resource-list') as HTMLDivElement;
            container.appendChild(paragraph);
        }
        let resourceName = ResourceType[resources[i].name]
        paragraph.innerHTML = resources[i].name + resources[i].icon + " " + resourceName + ": " + resources[i].amount;
    }
}
