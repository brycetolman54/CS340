import { IDocument } from "../document/IDocument";
import { Command } from "./Command";

export class DeleteCommand extends Command {
    private startIndex: number;
    private deletionDistance: number;
    private deletedText: string = "";

    public constructor(
        startIndex: number,
        deletionDistance: number,
        doc: IDocument
    ) {
        super(doc);
        this.startIndex = startIndex;
        this.deletionDistance = deletionDistance;
    }

    public execute() {
        this.deletedText = this.doc.delete(
            this.startIndex,
            this.deletionDistance
        );
        return this.deletedText;
    }

    public undo() {
        this.doc.insert(this.startIndex, this.deletedText);
    }
}
