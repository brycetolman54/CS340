class Drawer<T> {
    private items: T[];

    public constructor() {
        this.items = [];
    }

    public isEmpty(): boolean {
        return this.items.length == 0;
    }

    public addItem(item: T): void {
        this.items.push(item);
    }

    public removeItem(): T | undefined {
        return !this.isEmpty() ? this.items.splice(0, 1)[0] : undefined;
    }

    public removeAll(): void {
        this.items = [];
    }
}

class Dresser<T, U, V> {
    public top: Drawer<T> = new Drawer<T>();
    public middle: Drawer<U> = new Drawer<U>();
    public bottom: Drawer<V> = new Drawer<V>();
}

type Socks = { style: string; color: string };
type Shirt = { style: string; size: string };
type Pants = { waist: number; length: number };

let myDresser: Dresser<Socks, Shirt, Pants> = new Dresser();

let mySock: Socks = { style: "long", color: "blue" };
let myShirt: Shirt = { style: "tee-shirt", size: "M" };
let myPants: Pants = { waist: 32, length: 32 };

function main() {
    myDresser.top.addItem(mySock);
    myDresser.middle.addItem(myShirt);
    myDresser.bottom.addItem(myPants);

    let removedSock = myDresser.top.removeItem();
    console.log("Removed ", removedSock);
    let removedShirt = myDresser.middle.removeItem();
    console.log("Removed ", removedShirt);
    let removedPants = myDresser.bottom.removeItem();
    console.log("Removed ", removedPants);

    let undefinedSock = myDresser.top.removeItem();
    console.log("Tried to remove sock again: ", undefinedSock);
}

main();
