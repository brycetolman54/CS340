import { DecorationPlacer } from "./decoration/DecorationPlacer";
import { ChristmasFactory } from "./factory/ChristmasFactory";
import { HalloweenFactory } from "./factory/HalloweenFactory";

main();

function main(): void {
    let halloweenDecorationPlacer = new DecorationPlacer(
        new HalloweenFactory()
    );

    console.log("\nHalloween:");
    console.log(halloweenDecorationPlacer.placeDecorations());

    let christmasDecorationPlacer = new DecorationPlacer(
        new ChristmasFactory()
    );

    console.log("\nChristmas:");
    console.log(christmasDecorationPlacer.placeDecorations());
}
