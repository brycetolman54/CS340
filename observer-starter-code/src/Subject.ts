import { ObserverInterface } from "./ObserverInterface"
import { Flight } from "./entity/Flight"

export class Subject {
    
    private observers: ObserverInterface[] = []

    public subscribe(observer: ObserverInterface) {
        this.observers.push(observer)
    }

    public unsubscribe(observer: ObserverInterface) {
        this.observers.filter((obs) => obs != observer)
    }

    protected notify(flight: Flight | null) {
        this.observers.forEach((observer: ObserverInterface) => observer.update(flight))
    }

}