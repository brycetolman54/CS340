import { IDocument } from "../document/IDocument";
import { Command } from "./Command";

export class OpenCommand extends Command {
    private filename: string;
    private sequence: string = "";

    public constructor(filename: string, doc: IDocument) {
        super(doc);
        this.filename = filename;
    }

    public execute() {
        this.sequence = this.doc.getContents();
        this.doc.open(this.filename);
    }

    public undo() {
        this.doc.clear();
        this.doc.insert(0, this.sequence);
    }
}
