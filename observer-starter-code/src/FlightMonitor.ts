import { FlightFeed } from "./FlightFeed";
import { FlightDelta } from "./FlightDelta"
import { FlightStatus } from "./FlightStatus"

main();

function main() {

  let feed = new FlightFeed();

  feed.subscribe(new FlightDelta());
  feed.subscribe(new FlightStatus());

  feed.start();

}
