import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface ItemView<T> extends View {
    addItems: (items: T[]) => void;
}

export abstract class ItemPresenter<T, U> extends Presenter<ItemView<T>> {
    private _hasMoreItems: boolean = true;
    private _lastItem: T | null = null;

    private _service: U;

    public constructor(view: ItemView<T>) {
        super(view);
        this._service = this.createService();
    }

    protected get service(): U {
        return this._service;
    }

    protected get lastItem(): T | null {
        return this._lastItem;
    }

    protected set lastItem(value: T | null) {
        this._lastItem = value;
    }

    public get hasMoreItems(): boolean {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        this.doFailureReportingOperation(async () => {
            const [newItems, hasMore] = await this.getMoreItems(
                authToken,
                userAlias
            );

            this.hasMoreItems = hasMore;
            this.lastItem = newItems[newItems.length - 1];
            this.view.addItems(newItems);
        });
    }

    protected abstract getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[T[], boolean]>;

    protected abstract createService(): U;
}
