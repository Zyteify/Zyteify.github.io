class Gem{
    name: string;
    icon: string;
    amount: number;
    active: boolean;
    constructor(name: string, icon: string, amount: number, active: boolean) {
        this.name = name;
        this.icon = icon;
        this.amount = amount;
        this.active = active;
    }
    add(amount: number) {
        this.amount += amount;
    }
    subtract(amount: number) {
        this.amount -= amount;
    }
}