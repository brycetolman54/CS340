import { Command } from "./commands/Command";

export class UndoRedoManager {
    private undoStack: Command[];
    private redoStack: Command[];

    public constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    public undo() {
        let cmd = this.undoStack.pop() as Command;
        cmd.undo();
        this.redoStack.push(cmd);
    }

    public redo() {
        let cmd = this.redoStack.pop() as Command;
        cmd.execute();
        this.undoStack.push(cmd);
    }

    public canUndo(): boolean {
        return this.undoStack.length != 0;
    }

    public canRedo(): boolean {
        return this.redoStack.length != 0;
    }

    public execute(cmd: Command) {
        cmd.execute();
        this.undoStack.push(cmd);
        this.redoStack = [];
    }
}
