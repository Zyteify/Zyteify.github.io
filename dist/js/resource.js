"use strict";
//resource list
//food - 🍞
//wood - 🌲
//stone - ⛰️
//gems - 💎
//metal - ⚙️
//coins - 💰
//gourmet food - 🍖
const resourceIconMap = {
    'food': "🍞",
    'wood': "🌲",
    'stone': "⛰️",
    'copper': "⚙️",
    'silver': "🥈",
    'gold': "🥇",
    'coins': "💰",
};
class Resource {
    name;
    amount;
    icon;
    paragraph;
    active = false;
    constructor(name, amount) {
        this.name = name;
        this.amount = amount;
        this.icon = resourceIconMap[name];
        this.paragraph = document.createElement('p');
        this.paragraph.innerText = this.icon + " " + this.name + ": " + this.amount;
    }
}
function getResourceByName(name) {
    for (let i = 0; i < resources.length; i++) {
        if (resources[i].name === name) {
            return resources[i];
        }
    }
    return null;
}
