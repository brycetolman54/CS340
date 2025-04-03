import { UserDto, User } from "tweeter-shared";
import { FactoryDAO } from "../daos/FactoryDAO";
import { FollowDAO } from "../daos/FollowDAO";
import { Service } from "./Service";

export class FollowService extends Service {
    private followDAO: FollowDAO;

    public constructor(factory: FactoryDAO) {
        super(factory);
        this.followDAO = factory.getFollowDAO();
    }

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        await this.checkToken(token);

        const [items, hasMore] = await this.followDAO.getPageOfFollowers(
            userAlias,
            User.fromDto(lastItem),
            pageSize
        );
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        await this.checkToken(token);

        const [items, hasMore] = await this.followDAO.getPageOfFollowees(
            userAlias,
            User.fromDto(lastItem),
            pageSize
        );
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
    }
}
