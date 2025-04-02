import { StringSource } from "../StringSources/StringSource";
import { Decorator } from "./Decorator";

export class MixDecorator extends Decorator {
    private mixDegree: number;

    public constructor(stringSource: StringSource, mixDegree: number) {
        super(stringSource);
        this.mixDegree = mixDegree;
    }

    public next(): string {
        let str = this.stringSource.next();
        let len = str.length;
        if (len >= 2) {
            for (let i = 0; i < this.mixDegree; i++) {
                // get the indices to swap
                let xIdx = Math.floor(Math.random() * len);
                let yIdx = Math.floor(Math.random() * len);

                // get the chars to swap
                let x = str[xIdx];
                let y = str[yIdx];

                // swap the characters
                str = str.substring(0, xIdx) + y + str.substring(xIdx + 1);
                str = str.substring(0, yIdx) + x + str.substring(yIdx + 1);
            }
        }
        return str + " ";
    }
}
