import { StringSource } from "../StringSources/StringSource";

export abstract class Decorator implements StringSource {
    protected stringSource: StringSource;

    public constructor(stringSource: StringSource) {
        this.stringSource = stringSource;
    }

    public abstract next(): string;

    public more(): boolean {
        return this.stringSource.more();
    }
}
