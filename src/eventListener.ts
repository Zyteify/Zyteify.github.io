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


let dragItem: Item | null = null;
let dragWorker: Laborer | null = null;
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
                if (dragItem instanceof Item) {
                    //get the gear that is being dragged
                    //get the gear that is being dragged
                    let workerid: number = parseInt(myElement.id.replace('worker-div', ''));
                    //get the worker with the workerid

                    let dragWorkerDest = <Laborer>getWorkerById(workerid)
                    if (dragWorkerDest.weapon == null) {
                        myElement.classList.add('highlight');
                    }
                    else {
                        myElement.classList.add('highlight2');
                    }
                }
            });

            //allow the div to be dragged leave
            trackEventListeners(myElement, 'dragleave', function (event) {
                event.preventDefault();
                myElement.classList.remove('highlight');
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
                dragItem = null;
                dragWorker = null;
            });
        }
    }
}

function dropEvent(myElement: HTMLElement, event: Event) {
    event.preventDefault();
    myElement.classList.remove('highlight');
    myElement.classList.remove('highlight2');
    if (dragItem instanceof Item) {
        //if the element being dropped on is a worker
        if (myElement.classList.contains('worker-div')) {

            //get the gear that is being dragged
            let workerid: number = parseInt(myElement.id.replace('worker-div', ''));
            //get the worker with the workerid

            let dragWorkerDest = <Laborer>getWorkerById(workerid)

            if (dragWorker) {
                moveGear(<Item>dragItem, dragWorkerDest, dragWorker);
            }
            else {
                moveGear(<Item>dragItem, dragWorkerDest, items);
            }

        }
        else if (myElement === gearListDiv) {
            //if the element being dropped on is the body
            //add the gear to the list of items
            //check to see if the item is on a worker
            if (dragWorker) {
                moveGear(<Item>dragItem, items, dragWorker);
            }
            else {
                moveGear(<Item>dragItem, items, items);
            }//dropped on body
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
            dragWorker = workers[i];
        }
    }
    if (item) {
        dragItem = item;
    }
    else {
        console.log('item not found');
    }

}


const gearListDiv = document.getElementById('gear-list') as HTMLDivElement;
//add event listeners to the body to allow gear to be dropped back to the inventory
trackEventListeners(gearListDiv, 'drop', function (event) {
    // Create a list of elements that should not trigger the drop event
    let excludedChildren = document.getElementsByClassName('worker-div');
    gearListDiv.classList.remove('highlight');

    // Check if the clicked element is not one of the excluded children or their descendants
    if (event.target instanceof Element
        && !isExcludedElement(event.target, excludedChildren)) {
        dropEvent(gearListDiv, event);
    }
});

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


trackEventListeners(gearListDiv, 'dragover', function (event) {
    event.preventDefault(); // Necessary. Allows us to drop.    
    if (dragItem instanceof Item) {
        gearListDiv.classList.add('highlight');
    }
    return false;
});

//allow the div to be dragged leave
trackEventListeners(gearListDiv, 'dragleave', function (event) {
    event.preventDefault();
    gearListDiv.classList.remove('highlight');
    gearListDiv.classList.remove('highlight2');
});