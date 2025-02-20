import { Status } from "tweeter-shared";
import { ItemPresenter, ItemView } from "./ItemPresenter";
import { StatusService } from "../model/StatusService";

export interface StatusItemView extends ItemView<Status> {
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
