import { IDocument } from "../document/IDocument";
import { Command } from "./Command";

export class InsertCommand extends Command {
    private startIndex: number;
    private insertSequence: string;

    public constructor(
        startIndex: number,
        insertSequence: string,
        doc: IDocument
    ) {
        super(doc);
        this.startIndex = startIndex;
        this.insertSequence = insertSequence;
    }

    public execute() {
        this.doc.insert(this.startIndex, this.insertSequence);
    }

    public undo() {
        this.doc.delete(this.startIndex, this.insertSequence.length);
    }
}
