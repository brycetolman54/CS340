import { Status } from "tweeter-shared";
import { View } from "./Presenter";
import { ItemPresenter } from "./ItemPresenter";
import { StatusService } from "../model/StatusService";

export interface StatusItemView extends View {
    addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends ItemPresenter<
    Status,
    StatusService
> {
    protected createService(): StatusService {
        return new StatusService();
    }
}
