"use strict";
const eventListenerMap = new WeakMap();
function trackEventListeners(element, eventType, listener, options) {
    const record = { eventType, listener, options };
    const listeners = eventListenerMap.get(element) || [];
    listeners.push(record);
    eventListenerMap.set(element, listeners);
    element.addEventListener(eventType, listener, options);
}
function getEventListeners(element) {
    return eventListenerMap.get(element) || [];
}
class DragDiv {
    div;
    item;
    worker;
    source = [];
    setItem(item) {
        this.item = item;
    }
    setWorker(worker) {
        this.worker = worker;
    }
    getItem() {
        return this.item;
    }
    getWorker() {
        return this.worker;
    }
    hasItem() {
        if (this.item) {
            return true;
        }
        else {
            return false;
        }
    }
    hasWorker() {
        if (this.worker) {
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
        const myElement = workerDivs[i];
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
                    let workerid = parseInt(myElement.id.replace('worker-div', ''));
                    //get the worker with the workerid
                    let dragWorkerDest = getWorkerById(workerid);
                    if (dragWorkerDest.weapon == null) {
                        if (dragDiv.source != dragWorkerDest) {
                            myElement.classList.add('highlight1');
                        }
                    }
                    else {
                        if (dragDiv.source != dragWorkerDest) {
                            myElement.classList.add('highlight2');
                        }
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
        const myElement = gearDivs[i];
        //check if they have an event listener
        if (getEventListeners(myElement).length == 0) {
            //if they dont have an event listener
            //add an event listener to the div
            trackEventListeners(myElement, 'dragstart', function (event) {
                dragEventStart(myElement, event);
            });
            trackEventListeners(myElement, 'dragend', function (event) {
                //item is done dragging. remove the item from the dragItem variable
                dragDiv.item = undefined;
                dragDiv.worker = undefined;
                dragDiv.source = [];
            });
        }
    }
}
function dropEvent(myElement, event) {
    event.preventDefault();
    myElement.classList.remove('highlight1');
    myElement.classList.remove('highlight2');
    if (dragDiv.hasItem()) {
        //if the element being dropped on is a worker
        if (myElement.classList.contains('worker-div')) {
            //get the gear that is being dragged
            let workerid = parseInt(myElement.id.replace('worker-div', ''));
            //get the worker with the workerid
            let dragWorkerDest = getWorkerById(workerid);
            if (dragDiv.hasWorker()) {
                moveGear(dragDiv.item, dragWorkerDest, dragDiv.worker);
            }
            else {
                moveGear(dragDiv.item, dragWorkerDest, dragDiv.source);
            }
        }
        else if (myElement === gearListContainer) {
            //if the element being dropped on is the body
            //add the gear to the list of items
            //check to see if the item is on a worker
            if (dragDiv.hasWorker()) {
                moveGear(dragDiv.item, items, dragDiv.worker, gearListContainer);
            }
            else {
                moveGear(dragDiv.item, items, dragDiv.source, gearListContainer);
            } //dropped on body
        }
        //if dropped on the crafting section
        else if (myElement === craftingItemSectionDiv) {
            if (dragDiv.hasWorker()) {
                moveGear(dragDiv.item, craftingItems, dragDiv.worker, craftingItemSectionDiv);
            }
            else {
                moveGear(dragDiv.item, craftingItems, dragDiv.source, craftingItemSectionDiv);
            } //dropped on body
        }
        else if (myElement === deleteDiv) {
            let myItem = dragDiv.item;
            //create a prompt to confirm deletion
            let confirmDelete = confirm(`Are you sure you want to delete ${myItem.gear}?`);
            if (!confirmDelete) {
                return;
            }
            //delete the item and remove it from either the inventory or the workers inventory
            if (dragDiv.hasWorker()) {
                let dragWorker = dragDiv.worker;
                dragWorker.unequipItem(dragDiv.item);
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
            //todo double check works
            let div = dragDiv.div;
            getEventListeners(div).forEach(({ eventType, listener, options }) => {
                console.log(`removing event listener for ${eventType}`);
                div.removeEventListener(eventType, listener, options);
            });
            deletedItems.push(myItem);
        }
        else {
            console.log(`dropped on ${myElement.id}`);
        }
    }
}
function dragEventStart(myElement, event) {
    dragDiv.div = myElement;
    let dragSource = event.target;
    var dragImage = myElement.cloneNode(true);
    // Set the drag image opacity to 1 (opaque)
    if (dragImage instanceof HTMLElement) {
        dragImage.style.opacity = '1';
    }
    //get the gear that is being dragged
    let gearid = dragSource.id.replace('gear-div', '');
    //find the item from the list of items in storage or on a worker
    let item = items.find(item => item.id === parseInt(gearid));
    dragDiv.source = items;
    //also check the crafting items
    if (!item) {
        item = craftingItems.find(item => item.id === parseInt(gearid));
        dragDiv.source = craftingItems;
    }
    //loop through each worker and see if they are wearing the item
    for (let i = 0; i < workers.length; i++) {
        if (workers[i].weapon?.id === parseInt(gearid)) {
            item = workers[i].weapon;
            dragDiv.source = workers[i];
            dragDiv.setWorker(workers[i]);
        }
    }
    if (item) {
        dragDiv.setItem(item);
    }
    else {
        console.log('item not found');
        dragDiv.source = [];
    }
}
function isExcludedElement(element, excludedElements) {
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
    // Create a list of elements that should not trigger the drop event
    let excludedChildren = document.getElementsByClassName('worker-div');
    gearListContainer.classList.remove('highlight1');
    // Check if the clicked element is not one of the excluded children or their descendants
    if (event.target instanceof Element
        && !isExcludedElement(event.target, excludedChildren)) {
        dropEvent(gearListContainer, event);
    }
});
trackEventListeners(gearListContainer, 'dragover', function (event) {
    event.preventDefault(); // Necessary. Allows us to drop.    
    if (dragDiv.hasItem() && dragDiv.source != items) {
        gearListContainer.classList.add('highlight1');
    }
    return false;
});
//allow the div to be dragged leave
trackEventListeners(gearListContainer, 'dragleave', function (event) {
    event.preventDefault();
    gearListContainer.classList.remove('highlight1');
    gearListContainer.classList.remove('highlight2');
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
//craftingItemSectionDiv
trackEventListeners(craftingItemSectionDiv, 'dragover', function (event) {
    event.preventDefault(); // Necessary. Allows us to drop.    
    if (dragDiv.hasItem() && dragDiv.source != craftingItems) {
        craftingItemSectionDiv.classList.add('highlight1');
    }
    return false;
});
//allow the div to be dragged leave
trackEventListeners(craftingItemSectionDiv, 'dragleave', function (event) {
    event.preventDefault();
    craftingItemSectionDiv.classList.remove('highlight1');
});
trackEventListeners(craftingItemSectionDiv, 'drop', function (event) {
    event.preventDefault();
    craftingItemSectionDiv.classList.remove('highlight1');
    dropEvent(craftingItemSectionDiv, event);
});
