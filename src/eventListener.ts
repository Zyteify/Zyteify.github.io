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

function removeEventListenerOnce<T extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    eventType: T,
    callback: (event: HTMLElementEventMap[T]) => void
) {
    function handler(event: HTMLElementEventMap[T]) {
        callback.call(element, event);
        element.removeEventListener(eventType, handler);
    }

    element.addEventListener(eventType, handler);
}

function isChildOf(child: HTMLElement, parent: HTMLElement): boolean {
    let node = child.parentNode;
    while (node !== null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

class DragDiv {
    origin: {
        source: "items" | 'worker' | 'craftingItems' | Laborer | 'unknown';
        item: Item;
        worker?: Laborer;
        div: HTMLDivElement;
        sourceArray: Item[];
    }
    constructor() {
        this.origin = {} as any;
    }
    setItem(item: Item) {
        this.origin.item = item;
    }
    setWorker(worker: Laborer) {
        this.origin.worker = worker;
    }
    hasItem() {
        if (this.origin.item) {
            return true;
        }
        else {
            return false;
        }
    }
    hasWorker() {
        if (this.origin.worker) {
            return true;
        }
        else {
            return false;
        }
    }

}


let dragDiv = new DragDiv();

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
                    let workerid: number = parseInt(myElement.id.replace('worker-div', ''));
                    let dragWorkerDest = <Laborer>getWorkerById(workerid);
                    if (dragWorkerDest.weapon[0] == null) {
                        if (isChildOf(dragDiv.origin.div as HTMLElement, myElement) || dragDiv.origin.div === event.target) {
                            return; // Exit the event handler
                        }
                        debugger
                        myElement.classList.add('highlightCanMove');
                    } else {
                        if (isChildOf(dragDiv.origin.div as HTMLElement, myElement) || dragDiv.origin.div === event.target) {
                            debugger
                            return; // Exit the event handler
                        }
                        myElement.classList.add('highlightMayMove');
                    }
                }
            });
            

            //allow the div to be dragged leave
            trackEventListeners(myElement, 'dragleave', function (event) {
                event.preventDefault();
                removeAllHighlights(myElement)
            });

            //allow the div to be dropped on
            trackEventListeners(myElement, 'drop', function (event) {
                removeAllHighlights(myElement)
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
                dragDiv.origin = {} as any;
            });
        }
    }
}

function dropEvent(myElement: HTMLElement, event: Event) {
    event.preventDefault();
    removeAllHighlights(myElement)

    if (dragDiv.hasItem()) {
        //if the element being dropped on is a worker
        if (isWorkerDiv(myElement)) {

            //get the gear that is being dragged
            let workerId: number = getWorkerId(myElement);
            //get the worker with the workerid
            let worker = <Laborer>getWorkerById(workerId)

            moveGear2(dragDiv.origin.item, dragDiv.origin.source, dragDiv.origin.sourceArray, dragDiv.origin.div, worker, worker.weapon, myElement as HTMLDivElement);
        }
        //if the element being dropped on is the gear list container
        else if (myElement === gearListContainer) {
            moveGear2(dragDiv.origin.item, dragDiv.origin.source, dragDiv.origin.sourceArray, dragDiv.origin.div, 'gearListContainer', items, myElement as HTMLDivElement);
        }
        //if dropped on the crafting section
        else if (myElement === craftingItemSectionDiv) {
            moveGear2(dragDiv.origin.item, dragDiv.origin.source, dragDiv.origin.sourceArray, dragDiv.origin.div, 'craftingItems', craftingItems, myElement as HTMLDivElement);
        }
        else if (myElement === deleteDiv) {
            let myItem = <Item>dragDiv.origin.item
            //create a prompt to confirm deletion
            let confirmDelete = confirm(`Are you sure you want to delete ${myItem.gear}?`);
            if (!confirmDelete) {
                return;
            }
            //delete the item and remove it from either the inventory or the workers inventory
            if (dragDiv.hasWorker()) {
                let dragWorker = <Laborer>dragDiv.origin.worker
                dragWorker.unequipItem(<Item>dragDiv.origin.item);
                dragWorker.setVocation();
            }
            else if (dragDiv.origin.source == 'items') {
                removeItem(myItem, items)
            }
            else if (dragDiv.origin.source == 'craftingItems') {
                removeItem(myItem, craftingItems)
            }
            emptyGearDisplay();
            displayText();
            console.log(`deleting ${myItem.gear}`);
            myItem.delete();
        }
        else {
            console.log(`dropped on ${myElement.id} without an item found`);
        }
    }
    dragDiv.origin = {} as any;
}

//track the div and item that is being dragged into the dragDiv variable
function dragEventStart(myElement: HTMLElement, event: Event) {
    let dragSource = event.target as HTMLElement;

    //create the dragDiv element
    dragDiv.origin.div = myElement as HTMLDivElement;

    var dragImage = myElement.cloneNode(true);

    // Set the drag image opacity to 1 (opaque)
    if (dragImage instanceof HTMLElement) {
        dragImage.style.opacity = '1';
    }

    //get the gear that is being dragged
    let gearid: string = dragSource.id.replace('gear-div', '');

    //find the item from the list of items in storage or on a worker
    let item = items.find(item => item.id === parseInt(gearid));
    if (item) {
        dragDiv.setItem(item);
        dragDiv.origin.source = 'items';
        dragDiv.origin.sourceArray = items;
    }
    //also check the crafting items
    if (!item) {
        item = craftingItems.find(item => item.id === parseInt(gearid));
        if (item) {
            dragDiv.setItem(item);
            dragDiv.origin.sourceArray = craftingItems;
        }
    }

    //loop through each worker and see if they are wearing the item
    for (let i = 0; i < workers.length; i++) {
        if (workers[i].weapon[0]?.id === parseInt(gearid)) {
            item = <Item>workers[i].weapon[0];
            dragDiv.setItem(item);
            dragDiv.setWorker(workers[i]);
            dragDiv.origin.worker = workers[i];
            dragDiv.origin.source = workers[i];
        }
    }
    if (!item) {
        console.log('item not found');
        dragDiv.origin.source = 'unknown';
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

//add event listeners to the body to allow gear to be dropped back to the inventory
trackEventListeners(gearListContainer, 'drop', function (event) {
    removeAllHighlights(gearListContainer)
    dropEvent(gearListContainer, event);
});

//highlight the div when the item is dragged over it
trackEventListeners(gearListContainer, 'dragover', function (event) {
    event.preventDefault();
    if (dragDiv.hasItem() && dragDiv.origin.source != 'items') {
        roomAvailable(items) ? gearListContainer.classList.add('highlightCanMove') : gearListContainer.classList.add('highlightCannotMove');
    }
    return false;
});

//allow the div to be dragged leave
trackEventListeners(gearListContainer, 'dragleave', function (event) {
    event.preventDefault();
    removeAllHighlights(gearListContainer)
});

trackEventListeners(deleteDiv, 'dragover', function (event) {
    event.preventDefault(); // Necessary. Allows us to drop.    
    if (dragDiv.hasItem()) {
        deleteDiv.classList.add('highlightCanMove');
    }
    return false;
});

//allow the div to be dragged leave
trackEventListeners(deleteDiv, 'dragleave', function (event) {
    event.preventDefault();
    removeAllHighlights(deleteDiv)
});

trackEventListeners(deleteDiv, 'drop', function (event) {
    event.preventDefault();
    removeAllHighlights(gearListContainer)
    dropEvent(deleteDiv, event);
});

//craftingItemSectionDiv
trackEventListeners(craftingItemSectionDiv, 'dragover', function (event) {
    event.preventDefault(); // Necessary. Allows us to drop.    
    if (dragDiv.hasItem() && dragDiv.origin.source != 'craftingItems') {
        roomAvailable(craftingItems) ? craftingItemSectionDiv.classList.add('highlightCanMove') : craftingItemSectionDiv.classList.add('highlightCannotMove');
    }
    return false;
});

//allow the div to be dragged leave
trackEventListeners(craftingItemSectionDiv, 'dragleave', function (event) {
    event.preventDefault();
    removeAllHighlights(craftingItemSectionDiv);
});

trackEventListeners(craftingItemSectionDiv, 'drop', function (event) {
    event.preventDefault();
    removeAllHighlights(craftingItemSectionDiv);
    dropEvent(craftingItemSectionDiv, event);
});

//remove all highlights from the element
function removeAllHighlights(elemnt: HTMLElement) {
    elemnt.classList.remove('highlightCanMove')
    elemnt.classList.remove('highlightCannotMove')
    elemnt.classList.remove('highlightMayMove')
}

function isWorkerDiv(element: HTMLElement): boolean {
    if (element.classList.contains('worker-div')) {
        return true;
    }
    else {
        return false;
    }
}

function getWorkerId(element: HTMLElement): number {
    return parseInt(element.id.replace('worker-div', ''));
}
