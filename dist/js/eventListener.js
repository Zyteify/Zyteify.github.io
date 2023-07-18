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
function removeEventListenerOnce(element, eventType, callback) {
    function handler(event) {
        callback.call(element, event);
        element.removeEventListener(eventType, handler);
    }
    element.addEventListener(eventType, handler);
}
function isChildOf(child, parent) {
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
    origin;
    constructor() {
        this.origin = {};
    }
    setItem(item) {
        this.origin.item = item;
    }
    setWorker(worker) {
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
    //not needed as we are already going through each item as they all have the gear-div class
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
                    //check which item slot the item is 
                    let dragGearSlot = dragDiv.origin.item.baseType.gearSlot;
                    let workerid = parseInt(myElement.id.replace('worker-div', ''));
                    let dragWorkerDest = getWorkerById(workerid);
                    let itemArray = dragWorkerDest.getItemArray(dragGearSlot);
                    if (itemArray.length == 0) {
                        if (isChildOf(dragDiv.origin.div, myElement) || dragDiv.origin.div === event.target) {
                            return; // Exit the event handler
                        }
                        myElement.classList.add('highlightCanMove');
                    }
                    else {
                        if (isChildOf(dragDiv.origin.div, myElement) || dragDiv.origin.div === event.target) {
                            return; // Exit the event handler
                        }
                        myElement.classList.add('highlightMayMove');
                    }
                }
            });
            //allow the div to be dragged leave
            trackEventListeners(myElement, 'dragleave', function (event) {
                event.preventDefault();
                removeAllHighlights(myElement);
            });
            //allow the div to be dropped on
            trackEventListeners(myElement, 'drop', function (event) {
                removeAllHighlights(myElement);
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
                dragDiv.origin = {};
            });
            trackEventListeners(myElement, 'mouseover', function (event) {
                mouseoverEventStart(myElement, event);
            });
            trackEventListeners(myElement, 'mouseleave', function (event) {
                mouseLeaveEventStart(myElement, event);
            });
        }
    }
}
function mouseoverEventStart(myElement, event) {
    let item = findItem(myElement);
    if (item) {
        item.handleHover(event);
    }
    else {
    }
}
function mouseLeaveEventStart(myElement, event) {
    if (!dragDiv.hasItem()) {
        let item = findItem(myElement);
        if (item) {
            item.handleHoverLeave(event);
        }
        else {
        }
    }
}
function findItem(myElement) {
    let gearid = myElement.id.replace('gear-div', '');
    //find the item from the list of items in storage or on a worker
    let item = itemsInventory.find(item => item.id === parseInt(gearid));
    //also check the crafting items
    if (!item) {
        item = itemsCrafting.find(item => item.id === parseInt(gearid));
        if (!item) {
            //loop through each worker and see if they are wearing the item
            for (let i = 0; i < workers.length; i++) {
                let worker = workers[i];
                for (let j = 0; j < gearSlots.length; j++) {
                    let gearSlot = gearSlots[j];
                    let itemArray = worker.getItemArray(gearSlot);
                    if (itemArray.length > 0) {
                        if (itemArray[0].id === parseInt(gearid)) {
                            item = itemArray[0];
                            return item;
                        }
                    }
                }
            }
        }
    }
    if (item) {
        return item;
    }
    else {
        return null;
    }
}
function dropEvent(myElement, event) {
    event.preventDefault();
    removeAllHighlights(myElement);
    if (dragDiv.hasItem()) {
        //if the element being dropped on is a worker
        if (isWorkerDiv(myElement)) {
            //get the gear that is being dragged
            let workerId = getWorkerId(myElement);
            //get the worker with the workerid
            let worker = getWorkerById(workerId);
            //get the gear slot that the item is being dropped on
            let workerItemDiv = worker.getItemDiv(dragDiv.origin.item.baseType);
            let workerItemArray = worker.getItemArray(dragDiv.origin.item.baseType.gearSlot);
            moveGear(dragDiv.origin.item, dragDiv.origin.source, dragDiv.origin.sourceArray, dragDiv.origin.div, worker, workerItemArray, workerItemDiv);
        }
        //if the element being dropped on is the gear list container
        else if (myElement === gearListContainer) {
            moveGear(dragDiv.origin.item, dragDiv.origin.source, dragDiv.origin.sourceArray, dragDiv.origin.div, 'items', itemsInventory, myElement);
        }
        //if dropped on the crafting section
        else if (myElement === craftingItemSectionDiv) {
            moveGear(dragDiv.origin.item, dragDiv.origin.source, dragDiv.origin.sourceArray, dragDiv.origin.div, 'craftingItems', itemsCrafting, myElement);
        }
        else if (myElement === deleteDiv) {
            let myItem = dragDiv.origin.item;
            //create a prompt to confirm deletion
            let confirmDelete = confirm(`Are you sure you want to delete ${myItem.baseType.gearType}?`);
            if (!confirmDelete) {
                return;
            }
            emptyGearDisplay();
            displayText();
            console.log(`deleting ${myItem.baseType.gearType}`);
            myItem.remove();
        }
        else {
            console.log(`dropped on ${myElement.id} without an item found`);
        }
    }
    dragDiv.origin = {};
}
//track the div and item that is being dragged into the dragDiv variable
function dragEventStart(myElement, event) {
    let dragSource = event.target;
    //create the dragDiv element
    dragDiv.origin.div = myElement;
    var dragImage = myElement.cloneNode(true);
    // Set the drag image opacity to 1 (opaque)
    if (dragImage instanceof HTMLElement) {
        dragImage.style.opacity = '1';
    }
    //get the gear that is being dragged
    let gearid = dragSource.id.replace('gear-div', '');
    //find the item from the list of items in storage or on a worker
    let item = itemsInventory.find(item => item.id === parseInt(gearid));
    if (item) {
        dragDiv.setItem(item);
        dragDiv.origin.source = 'items';
        dragDiv.origin.sourceArray = itemsInventory;
    }
    //also check the crafting items
    if (!item) {
        item = itemsCrafting.find(item => item.id === parseInt(gearid));
        if (item) {
            dragDiv.setItem(item);
            dragDiv.origin.source = 'craftingItems';
            dragDiv.origin.sourceArray = itemsCrafting;
        }
    }
    //loop through each worker and see if they are wearing the item
    for (let i = 0; i < workers.length; i++) {
        for (let j = 0; j < gearSlots.length; j++) {
            let gearSlot = gearSlots[j];
            let itemArray = workers[i].getItemArray(gearSlot);
            if (itemArray[0]?.id === parseInt(gearid)) {
                item = itemArray[0];
                dragDiv.setItem(item);
                dragDiv.setWorker(workers[i]);
                dragDiv.origin.worker = workers[i];
                dragDiv.origin.source = workers[i];
                dragDiv.origin.sourceArray = itemArray;
                break;
            }
        }
    }
    if (!item) {
        console.log('item not found');
        dragDiv.origin.source = 'unknown';
    }
    if (item) {
        //trigger the hover handle leave event
        item.handleHoverLeave(event);
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
    removeAllHighlights(gearListContainer);
    dropEvent(gearListContainer, event);
});
//highlight the div when the item is dragged over it
trackEventListeners(gearListContainer, 'dragover', function (event) {
    event.preventDefault();
    if (dragDiv.hasItem() && dragDiv.origin.source != 'items') {
        roomAvailable(itemsInventory) ? gearListContainer.classList.add('highlightCanMove') : gearListContainer.classList.add('highlightCannotMove');
    }
    return false;
});
//allow the div to be dragged leave
trackEventListeners(gearListContainer, 'dragleave', function (event) {
    event.preventDefault();
    removeAllHighlights(gearListContainer);
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
    removeAllHighlights(deleteDiv);
});
trackEventListeners(deleteDiv, 'drop', function (event) {
    event.preventDefault();
    removeAllHighlights(gearListContainer);
    dropEvent(deleteDiv, event);
});
//craftingItemSectionDiv
trackEventListeners(craftingItemSectionDiv, 'dragover', function (event) {
    event.preventDefault(); // Necessary. Allows us to drop.    
    if (dragDiv.hasItem() && dragDiv.origin.source != 'craftingItems') {
        roomAvailable(itemsCrafting) ? craftingItemSectionDiv.classList.add('highlightCanMove') : craftingItemSectionDiv.classList.add('highlightCannotMove');
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
function removeAllHighlights(elemnt) {
    elemnt.classList.remove('highlightCanMove');
    elemnt.classList.remove('highlightCannotMove');
    elemnt.classList.remove('highlightMayMove');
}
function isWorkerDiv(element) {
    if (element.classList.contains('worker-div')) {
        return true;
    }
    else {
        return false;
    }
}
function getWorkerId(element) {
    return parseInt(element.id.replace('worker-div', ''));
}
