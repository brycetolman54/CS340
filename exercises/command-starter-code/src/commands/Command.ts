import { IDocument } from "../document/IDocument";

export abstract class Command {
    protected doc: IDocument;

    public constructor(doc: IDocument) {
        this.doc = doc;
    }

    public abstract execute(): void;
    public abstract undo(): void;
}
