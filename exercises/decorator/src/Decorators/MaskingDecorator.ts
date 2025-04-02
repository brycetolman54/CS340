import { StringSource } from "../StringSources/StringSource";
import { Decorator } from "./Decorator";

export class MaskingDecorator extends Decorator {
    private maskFrequency: number;
    private i = 0;

    public constructor(stringSource: StringSource, maskFrequency: number) {
        super(stringSource);
        this.maskFrequency = maskFrequency;
    }

    public next(): string {
        let str = "";
        if (this.i % this.maskFrequency == 0) {
            str = "*".repeat(this.stringSource.next().length);
        } else {
            str = this.stringSource.next();
        }
        this.i++;
        return str + " ";
    }
}
