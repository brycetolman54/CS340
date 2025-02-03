import { Flight } from "./entity/Flight"

export interface ObserverInterface {
    update(flight: Flight | null): void;
}