import * as fs from "fs";
import { StringSource } from "./StringSource";

export class FileString implements StringSource {
    private strs: string[];
    private idx = 0;

    public constructor(filename: string) {
        let str = fs.readFileSync(filename, "utf-8");
        this.strs = str.split(" ");
    }

    public next(): string {
        let str = this.strs[this.idx];
        this.idx++;
        return str;
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
