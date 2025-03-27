import { UserDto, FakeData, User } from "tweeter-shared";
import { FactoryDAO } from "../daos/FactoryDAO";

export class FollowService {
    private factory: FactoryDAO;

    public constructor(factory: FactoryDAO) {
        this.factory = factory;
    }

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize, userAlias);
    }

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize, userAlias);
    }

    private async getFakeData(
        lastItem: UserDto | null,
        pageSize: number,
        userAlias: string
    ): Promise<[UserDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfUsers(
            User.fromDto(lastItem),
            pageSize,
            userAlias
        );
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }
}
