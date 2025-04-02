import { StringSource } from "../StringSources/StringSource";
import { Decorator } from "./Decorator";

export class WhiteSpaceDecorator extends Decorator {
    private filler: string;

    public constructor(stringSource: StringSource, filler: string) {
        super(stringSource);
        this.filler = filler;
    }
    public next(): string {
        return this.stringSource.next() + this.filler;
    }
}
