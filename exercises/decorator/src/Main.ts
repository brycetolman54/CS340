import { Decorator } from "./Decorators/Decorator";
import { MaskingDecorator } from "./Decorators/MaskingDecorator";
import { MixDecorator } from "./Decorators/MixDecorator";
import { WhiteSpaceDecorator } from "./Decorators/WhiteSpaceDecorator";
import { FileString } from "./StringSources/FileStrings";
import { HardCoded } from "./StringSources/HardCoded";
import { StringSource } from "./StringSources/StringSource";

function Main() {
    console.log("\nStarting with a Hard Coded String:");
    let myString: StringSource = new HardCoded(
        "This is my super fun hard coded string that you get to look at. Admire it while you can!"
    );
    let mixDecorator: Decorator = new MixDecorator(myString, 4);
    let maskingDecorator: Decorator = new MaskingDecorator(myString, 3);
    let whiteSpaceDecorator: Decorator = new WhiteSpaceDecorator(
        myString,
        "--"
    );

    console.log();
    process.stdout.write("\t");
    while (mixDecorator.more()) {
        process.stdout.write(mixDecorator.next());
    }
    console.log();

    console.log();
    process.stdout.write("\t");
    while (maskingDecorator.more()) {
        process.stdout.write(maskingDecorator.next());
    }
    console.log();

    console.log();
    process.stdout.write("\t");
    while (whiteSpaceDecorator.more()) {
        process.stdout.write(whiteSpaceDecorator.next());
    }
    console.log();

    console.log("\nGoing to a String from a file:");
    myString = new FileString("mine.txt");
    mixDecorator = new MixDecorator(myString, 4);
    maskingDecorator = new MaskingDecorator(myString, 3);
    whiteSpaceDecorator = new WhiteSpaceDecorator(myString, "--");

    console.log();
    process.stdout.write("\t");
    while (mixDecorator.more()) {
        process.stdout.write(mixDecorator.next());
    }
    console.log();

    console.log();
    process.stdout.write("\t");
    while (maskingDecorator.more()) {
        process.stdout.write(maskingDecorator.next());
    }
    console.log();

    console.log();
    process.stdout.write("\t");
    while (whiteSpaceDecorator.more()) {
        process.stdout.write(whiteSpaceDecorator.next());
    }
    console.log();

    console.log("\nDoing two decorators at once:");
    mixDecorator = new MixDecorator(myString, 4);
    maskingDecorator = new MaskingDecorator(mixDecorator, 3);

    console.log();
    process.stdout.write("\t");
    while (maskingDecorator.more()) {
        process.stdout.write(maskingDecorator.next());
    }
    console.log();
}

Main();
