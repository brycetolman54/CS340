import { ObserverInterface } from "./ObserverInterface"
import { Flight } from "./entity/Flight"

export class FlightDelta implements ObserverInterface {

    private lastFlight: Flight | null = null

    public update(flight: Flight | null) {

        if(flight != null) {
            let longitude: number = this.lastFlight == null ? flight.longitude : flight.longitude - this.lastFlight?.longitude 
            let latitude: number = this.lastFlight == null ? flight.latitude : flight.latitude - this.lastFlight?.latitude
            let velocity: number = this.lastFlight == null ? flight.velocity : flight.velocity - this.lastFlight?.velocity
            let altitude: number = this.lastFlight == null ? flight.geo_altitude : flight.geo_altitude - this.lastFlight.geo_altitude

            console.log(
                "\nDetla Stats:",
                "\nLongitude: \t",
                longitude,
                "\nLatitude: \t",
                latitude,
                "\nVelocity: \t",
                velocity,
                "\nAltitude: \t",
                altitude
            )
        }

        this.lastFlight = flight;

        return;
    }
    
}