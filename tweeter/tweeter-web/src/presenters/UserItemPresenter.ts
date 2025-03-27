import { User } from "tweeter-shared";
import { ItemPresenter, ItemView } from "./ItemPresenter";
import { FollowService } from "../model/services/FollowService";

export interface UserItemView extends ItemView<User> {
    addItems: (newItems: User[]) => void;
}

export abstract class UserItemPresenter extends ItemPresenter<
    User,
    FollowService
> {
    protected createService(): FollowService {
        return new FollowService();
    }
}
