import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../net/ServerFacade";

export class FollowService {
    private serverFacade = new ServerFacade();

    public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        return this.serverFacade.getMoreFollowees({
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem == null ? null : lastItem.dto,
        });
    }

    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        return this.serverFacade.getMoreFollowers({
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem == null ? null : lastItem.dto,
        });
    }
}
