export interface View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
    clearLastInfoMessage: () => void;
    displayInfoMessage: (message: string, time: number) => void;
}

export abstract class Presenter<S, V extends View> {
    private _view: V;
    private _service: S;

    protected constructor(view: V) {
        this._view = view;
        this._service = this.createService();
    }

    protected get service(): S {
        return this._service;
    }

    protected abstract createService(): S;

    protected get view(): V {
        return this._view;
    }

    protected async doFailureReportingOperation(
        tryOperation: () => Promise<void>,
        operationDescription: string,
        finalOperation: () => void = () => {}
    ): Promise<void> {
        try {
            await tryOperation();
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to ${operationDescription} because of exeception: ${error}`
            );
        } finally {
            finalOperation();
        }
    }
}
