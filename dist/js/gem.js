"use strict";
class Gem {
    name;
    icon;
    amount;
    active;
    constructor(name, icon, amount, active) {
        this.name = name;
        this.icon = icon;
        this.amount = amount;
        this.active = active;
    }
    add(amount) {
        this.amount += amount;
    }
    subtract(amount) {
        this.amount -= amount;
    }
}
