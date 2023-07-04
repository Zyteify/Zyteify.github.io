//track if an element has an event listener attached to it
//must use trackEventListeners to add event listeners to elements
type EventListenerRecord = {
    eventType: string;
    listener: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
};

const eventListenerMap = new WeakMap<HTMLElement, EventListenerRecord[]>();

function trackEventListeners(element: HTMLElement, eventType: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
    const record: EventListenerRecord = { eventType, listener, options };
    const listeners = eventListenerMap.get(element) || [];

    listeners.push(record);
    eventListenerMap.set(element, listeners);

    element.addEventListener(eventType, listener, options);
}

function getEventListeners(element: HTMLElement): EventListenerRecord[] {
    return eventListenerMap.get(element) || [];
}

class DragDiv{

    div?: HTMLDivElement;
    item?: Item;
    worker?: Laborer;
    setItem(item: Item){
        this.item = item;
    }
    setWorker(worker: Laborer){
        this.worker = worker;
    }
    getItem(){
        return this.item;
    }
    getWorker(){
        return this.worker;
    }
    hasItem(){
        if(this.item){
            return true;
        }
        else{
            return false;
        }
    }
    hasWorker(){
        if(this.worker){
            return true;
        }
        else{
            return false;
        }
    }
    
}

let dragDiv: DragDiv = new DragDiv();

//loop through each worker and add an event listener to their div
function updateEventListeners() {

    //get the list of worker divs
    const workerDivs = document.getElementsByClassName('worker-div');
    //loop through each worker div
    for (let i = 0; i < workerDivs.length; i++) {
        const myElement = workerDivs[i] as HTMLElement;
        //check if they have an event listener
        if (getEventListeners(myElement).length == 0) {
            //if they dont have an event listener
            //add an event listener to the div


            //allow the div to be dragged over
            trackEventListeners(myElement, 'dragover', function (event) {
                event.preventDefault();
                if (dragDiv.hasItem()) {
                    //get the gear that is being dragged
                    //get the gear that is being dragged
                    let workerid: number = parseInt(myElement.id.replace('worker-div', ''));
                    //get the worker with the workerid

                    let dragWorkerDest = <Laborer>getWorkerById(workerid)
                    if (dragWorkerDest.weapon == null) {
                        myElement.classList.add('highlight1');
                    }
                    else {
                        myElement.classList.add('highlight2');
                    }
                }
            });

            //allow the div to be dragged leave
            trackEventListeners(myElement, 'dragleave', function (event) {
                event.preventDefault();
                myElement.classList.remove('highlight1');
                myElement.classList.remove('highlight2');
            });

            //allow the div to be dropped on
            trackEventListeners(myElement, 'drop', function (event) {
                dropEvent(myElement, event);
            });
        }
    }

    //get the list of gear divs
    const gearDivs = document.getElementsByClassName('gear-div');
    //loop through each gear div
    for (let i = 0; i < gearDivs.length; i++) {
        const myElement = gearDivs[i] as HTMLElement;
        //check if they have an event listener
        if (getEventListeners(myElement).length == 0) {
            //if they dont have an event listener
            //add an event listener to the div
            trackEventListeners(myElement, 'dragstart', function (event) {
                dragEventStart(myElement, event)
            });

            trackEventListeners(myElement, 'dragend', function (event) {
                //item is done dragging. remove the item from the dragItem variable
                dragDiv.item = undefined;
                dragDiv.worker = undefined;
            });
        }
    }
}

function dropEvent(myElement: HTMLElement, event: Event) {
    event.preventDefault();
    myElement.classList.remove('highlight1');
    myElement.classList.remove('highlight2');
    if (dragDiv.hasItem()) {
        //if the element being dropped on is a worker
        if (myElement.classList.contains('worker-div')) {

            //get the gear that is being dragged
            let workerid: number = parseInt(myElement.id.replace('worker-div', ''));
            //get the worker with the workerid

            let dragWorkerDest = <Laborer>getWorkerById(workerid)

            if (dragDiv.hasWorker()) {
                moveGear(<Item>dragDiv.item, dragWorkerDest, <Laborer>dragDiv.worker);
            }
            else {
                moveGear(<Item>dragDiv.item, dragWorkerDest, items);
            }

        }
        else if (myElement === gearListDiv) {
            //if the element being dropped on is the body
            //add the gear to the list of items
            //check to see if the item is on a worker
            if (dragDiv.hasWorker()) {
                moveGear(<Item>dragDiv.item, items, <Laborer>dragDiv.worker);
            }
            else {
                moveGear(<Item>dragDiv.item, items, items);
            }//dropped on body
        }
        else if (myElement === deleteDiv) {
            let myItem = <Item>dragDiv.item

            
            //create a prompt to confirm deletion
            let confirmDelete = confirm(`Are you sure you want to delete ${myItem.gear}?`);
            if (!confirmDelete) {
                return;
            }
            
            //delete the item and remove it from either the inventory or the workers inventory
            if (dragDiv.hasWorker()) {
                let dragWorker = <Laborer>dragDiv.worker
                dragWorker.unequipItem(<Item>dragDiv.item);
                dragWorker.setVocation();
            }
            else {
                items = items.filter(item => item.id !== myItem.id);
                game.gearCountCurrent--;
            }
            emptyGearDisplay();

            displayText();
            console.log(`deleting ${myItem.gear}`);
            //remove event listeners from the item
            let div = <HTMLDivElement>dragDiv.div;
            getEventListeners(div).forEach(({ eventType, listener, options }) => {
                console.log(`removing event listener for ${eventType}`);
                
                div.removeEventListener(eventType, listener, options);
            });
                        
        }
        else {
            console.log(`dropped on ${myElement.id}`);
        }
    }
}

function dragEventStart(myElement: HTMLElement, event: Event) {
    let dragSource = event.target as HTMLElement;
    //get the gear that is being dragged
    let gearid: string = dragSource.id.replace('gear-div', '');

    //find the item from the list of items in storage or on a worker
    let item = items.find(item => item.id === parseInt(gearid));
    //loop through each worker and see if they are wearing the item
    for (let i = 0; i < workers.length; i++) {
        if (workers[i].weapon?.id === parseInt(gearid)) {
            item = <Item>workers[i].weapon;
            dragDiv.setWorker(workers[i]);
        }
    }
    if (item) {
        dragDiv.setItem(item);
    }
    else {
        console.log('item not found');
    }

}

function isExcludedElement(element: Element, excludedElements: HTMLCollectionOf<Element>): boolean {
    const stack = [element];

    while (stack.length) {
        const currentElement = stack.pop();

        if (currentElement) {
            for (let i = 0; i < excludedElements.length; i++) {
                if (excludedElements[i] === currentElement || excludedElements[i].contains(currentElement)) {
                    return true;
                }
            }

            if (currentElement.parentElement) {
                stack.push(currentElement.parentElement);
            }
        }
    }

    return false;
}

const gearListDiv = document.getElementById('gear-list') as HTMLDivElement;
//add event listeners to the body to allow gear to be dropped back to the inventory
trackEventListeners(gearListDiv, 'drop', function (event) {
    // Create a list of elements that should not trigger the drop event
    let excludedChildren = document.getElementsByClassName('worker-div');
    gearListDiv.classList.remove('highlight1');

    // Check if the clicked element is not one of the excluded children or their descendants
    if (event.target instanceof Element
        && !isExcludedElement(event.target, excludedChildren)) {
        dropEvent(gearListDiv, event);
    }
});

trackEventListeners(gearListDiv, 'dragover', function (event) {
    event.preventDefault(); // Necessary. Allows us to drop.    
    if (dragDiv.hasItem()) {
        gearListDiv.classList.add('highlight1');
    }
    return false;
});

//allow the div to be dragged leave
trackEventListeners(gearListDiv, 'dragleave', function (event) {
    event.preventDefault();
    gearListDiv.classList.remove('highlight1');
    gearListDiv.classList.remove('highlight2');
});

trackEventListeners(deleteDiv, 'dragover', function (event) {
    event.preventDefault(); // Necessary. Allows us to drop.    
    if (dragDiv.hasItem()) {
        deleteDiv.classList.add('highlight3');
    }
    return false;
});

//allow the div to be dragged leave
trackEventListeners(deleteDiv, 'dragleave', function (event) {
    event.preventDefault();
    deleteDiv.classList.remove('highlight3');
});

trackEventListeners(deleteDiv, 'drop', function (event) {
    event.preventDefault();
    deleteDiv.classList.remove('highlight3');
    dropEvent(deleteDiv, event);
});