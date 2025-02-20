export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
    clearLastInfoMessage: () => void;
    displayInfoMessage: (message: string, time: number) => void;
}

export abstract class Presenter<V extends View> {
    private _view: V;

    protected constructor(view: V) {
        this._view = view;
    }

    protected get view(): V {
        return this._view;
    }

    protected async doFailureReportingOperation(
        tryOperation: () => Promise<void>,
        finalOperation: () => void = () => {}
    ): Promise<void> {
        try {
            await tryOperation();
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to ${this.getOperationDescription()} because of exeception: ${error}`
            );
        } finally {
            finalOperation();
        }
    }

    protected abstract getOperationDescription(): string;
}
