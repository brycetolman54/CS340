import { StringSource } from "./StringSource";

export class HardCoded implements StringSource {
    private strs: string[];
    private idx = 0;

    public constructor(str: string) {
        this.strs = str.split(" ");
    }

    public next(): string {
        let ret = this.strs[this.idx];
        this.idx++;
        return ret;
    }

    public more(): boolean {
        if (this.idx == this.strs.length) {
            this.idx = 0;
            return false;
        } else {
            return true;
        }
    }
}
