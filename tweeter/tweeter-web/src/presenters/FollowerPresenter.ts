import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./ItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
    protected async getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[User[], boolean]> {
        return await this.service.loadMoreFollowers(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }

    protected getOperationDescription(): string {
        return "load followers";
    }
}
