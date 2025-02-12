import { ObserverInterface } from "./ObserverInterface";
import { Flight } from "./entity/Flight"

export class FlightStatus implements ObserverInterface {

    public update(flight: Flight | null) {
        if(flight != null) {
            console.log(
                "\nFlight:",
                "\nTransponder ID:\t",
                flight.icao24,
                "\nCall sign: \t",
                flight.callsign,
                "\nOrigin Country:\t",
                flight.origin_country,
                "\nLongitude: \t",
                flight.longitude,
                "\nLattitude: \t",
                flight.latitude,
                "\nVelocity: \t",
                flight.velocity,
                "\nAltitude: \t",
                flight.geo_altitude
            )
        } else {
            console.log("Flight over!");
        }
        return;
    }

}