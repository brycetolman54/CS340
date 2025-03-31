import { IDocument } from "../document/IDocument";
import { Command } from "./Command";

export class ReplaceCommand extends Command {
    private replaceIndex: number;
    private replaceDistance: number;
    private replacementString: string;
    private replacedString: string = "";

    public constructor(
        replaceIndex: number,
        replaceDistance: number,
        replacementString: string,
        doc: IDocument
    ) {
        super(doc);
        this.replaceIndex = replaceIndex;
        this.replaceDistance = replaceDistance;
        this.replacementString = replacementString;
    }

    public execute() {
        this.replacedString = this.doc.delete(
            this.replaceIndex,
            this.replaceDistance
        );
        this.doc.insert(this.replaceIndex, this.replacementString);
    }

    public undo() {
        this.doc.delete(this.replaceIndex, this.replacementString.length);
        this.doc.insert(this.replaceIndex, this.replacedString);
    }
}
