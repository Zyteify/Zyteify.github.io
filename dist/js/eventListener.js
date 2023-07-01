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
let dragItem = null;
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
                //get the gear that is being dragged
                let workerid = myElement.id.replace('worker-div', '');
                let dragWorker = workers[parseInt(workerid)];
                if (dragWorker.weapon == null) {
                    myElement.classList.add('highlight');
                }
                else {
                    myElement.classList.add('highlight2');
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
        const myElement = gearDivs[i];
        //check if they have an event listener
        if (getEventListeners(myElement).length == 0) {
            //if they dont have an event listener
            //add an event listener to the div
            //allow the div to be dropped on
            trackEventListeners(myElement, 'dragstart', function (event) {
                dragEventStart(myElement, event);
            });
            trackEventListeners(myElement, 'dragend', function (event) {
                //item is done dragging. remove the item from the dragItem variable
                dragItem = null;
            });
        }
    }
}
function dropEvent(myElement, event) {
    event.preventDefault();
    myElement.classList.remove('highlight');
    myElement.classList.remove('highlight2');
    //get the gear that is being dragged
    let workerid = myElement.id.replace('worker-div', '');
    let dragWorker = workers[parseInt(workerid)];
    //see if the worker already has an item equipped
    if (dragWorker.weapon != null) {
        //remove the item from the worker
        console.log(`removing item ${dragWorker.weapon.gear} from worker ${dragWorker.name}`);
        removeGearfromWorker(dragWorker.weapon, dragWorker);
    }
    console.log(`adding item ${dragItem?.gear} from worker ${dragWorker.name}`);
    addGearToWorker(dragItem, dragWorker);
}
function dragEventStart(myElement, event) {
    let dragSource = event.target;
    //get the gear that is being dragged
    let gearid = dragSource.id.replace('gear-div', '');
    let item = items.find(item => item.id === parseInt(gearid));
    if (item) {
        dragItem = item;
    }
    else {
        console.log('item not found');
    }
}
