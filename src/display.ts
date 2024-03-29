function displayAll() {
    displayText();
    displayGear();
    displayResources();
    displayGems();
    displayCraftWork();
    displayUpgrades();
}

function displayText() {
    //game-time
    days.innerHTML = `day ${game.days.toString()}`
    hours.innerHTML = game.hours.toString();
    hours.innerHTML = convertHoursToTime(game.hours);

    updateEventListeners()


    updateCraftButton()
}

function displayGear() {
    //each item in items
    for (let i = 0; i < itemsInventory.length; i++) {
        itemsInventory[i].setParentDiv(gearListContainer)
        itemsInventory[i].resetDiv()
    }
    //and each item in craftingItems
    for (let i = 0; i < itemsCrafting.length; i++) {
        itemsCrafting[i].setParentDiv(craftingItemSectionDiv)
        itemsCrafting[i].resetDiv()
    }

}

function displayResources() {
    //loop through each resource and create a paragraph element for them if it doesn't exist
    for (let i = 0; i < resources.length; i++) {
        resources[i].display()
    }
    //if the resources need to be displayed, also do the upgrades
    displayUpgrades()
}

function displayGems() {
    //loop through each resource and create a image element for them if it doesn't exist
    for (let i = 0; i < gems.length; i++) {
        gems[i].display()
    }
}

function emptyGearDisplay() {
    const container = gearListContainer;
    container.innerHTML = "";
    displayGear()
    controlCraftingButtons()
}

function displayUpgrades() {
    for (let i = 0; i < upgrades.length; i++) {
        upgrades[i].display()
    }
}

function setTextfromAffixes(stringText: string, stringValue: number): string {
    //get the position to put the value of the stat by the #
    let position = stringText.search("#");
    let text = 'ERROR'
    //if the position is -1, then there is no # in the stat
    if (position == -1) {
        text = `${stringText}`;
    }
    //if the position is 0, then the # is at the beginning of the stat
    else if (position == 0) {
        text = `${stringValue}${stringText.slice(1)}`;
    }
    //if the position is at the end of the stat
    else if (position == stringText.length - 1) {
        text = `${stringText.slice(0, -1)}${stringValue}`;
    }
    //if the position is in the middle of the stat
    else {
        text = `${stringText.slice(0, position)}${stringValue}${stringText.slice(position + 1)}`;
    }
    return text
}

function displayCraftWork() {
    materialsCraftWork.innerHTML = (`🔨 ${craftWork.toString()}`);
}

configureShowButtons()

//if the menu button is pressed, show that section
function configureShowButtons() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].button.addEventListener('click', function () {
            showMainDiv(buttons[i].div)
        })
    }
}


let activeDiv = worldDiv
//who the main section. 
function showMainDiv(div: HTMLDivElement) {
    emptyDiv.classList.add('hide');
    emptyDiv.classList.remove('show');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].div.classList.add('hide');
        buttons[i].div.classList.remove('show');
        buttons[i].button.classList.remove('main-active');
        if (div == buttons[i].div) {
            if (activeDiv == div) {
                buttons[i].button.classList.remove('main-active');
                buttons[i].div.classList.remove('show');
                activeDiv = emptyDiv
                emptyDiv.classList.add('show');
            } else {
                buttons[i].button.classList.add('main-active');
                buttons[i].div.classList.add('show');
                activeDiv = div
            }
        }
    }
}

//initially have the upgrades active
showMainDiv(upgradeDiv)

function flashUpgradeButton(): boolean {
    if (activeDiv != upgradeDiv) {
        buttonUpgrades.classList.remove('flash-border-good');
        buttonUpgrades.classList.add('flash-border-good');
        setTimeout(function () {
            buttonUpgrades.classList.remove('flash-border-good');
        }, 50000);
        return true
    }
    else {
        return false
    }
}

function flashElementGood(element: HTMLElement) {
    element.classList.remove('flash-border-bad');
    element.classList.add('flash-border-good');
    setTimeout(function () {
        element.classList.remove('flash-border-good');
    }, 5000);
}

function flashElementBad(element: HTMLElement) {
    element.classList.remove('flash-border-good');
    element.classList.remove('flash-border-bad');
    element.classList.add('flash-border-bad');
    setTimeout(function () {
        element.classList.remove('flash-border-bad');
    }, 5000);
}