import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusitemPresenter";
import { PAGE_SIZE } from "./ItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
    protected async getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[Status[], boolean]> {
        return await this.service.loadMoreFeedItems(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }

    protected getOperationDescription(): string {
        return "load feed items";
    }
}
