export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
    clearLastInfoMessage: () => void;
    displayInfoMessage: (message: string, time: number) => void;
}

export class Presenter<V extends View> {
    private _view: V;

    protected constructor(view: V) {
        this._view = view;
    }

    protected get view(): V {
        return this._view;
    }

    protected async doFailureReportingOperation(
        operation: () => Promise<void>,
        operationDescription: string
    ): Promise<void> {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to ${operationDescription} because of execpetion: ${error}`
            );
        }
    }
}
