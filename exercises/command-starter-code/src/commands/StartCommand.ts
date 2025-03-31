import { IDocument } from "../document/IDocument";
import { Command } from "./Command";

export class StartCommand extends Command {
    private sequence: string = "";

    public constructor(doc: IDocument) {
        super(doc);
    }

    public execute() {
        this.sequence = this.doc.getContents();
        this.doc.clear();
    }

    public undo() {
        this.doc.insert(0, this.sequence);
    }
}
