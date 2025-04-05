import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusitemPresenter";
import { PAGE_SIZE } from "./ItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
    protected async getMoreItems(
        authToken: AuthToken,
        userAlias: string
    ): Promise<[Status[], boolean]> {
        return await this.service.loadMoreStoryItems(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }

    protected getOperationDescription(): string {
        return "load story items";
    }
}
