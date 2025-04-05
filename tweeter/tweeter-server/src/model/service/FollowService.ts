import { UserDto, User } from "tweeter-shared";
import { FactoryDAO } from "../daos/general/FactoryDAO";
import { FollowDAO } from "../daos/general/FollowDAO";
import { Service } from "./Service";

export class FollowService extends Service {
    private followDAO: FollowDAO;

    public constructor(factory: FactoryDAO) {
        super(factory);
        this.followDAO = factory.getFollowDAO();
    }

    public async loadMoreFollows(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null,
        followers: boolean
    ): Promise<[UserDto[], boolean]> {
        await this.checkToken(token);

        const page = await this.followDAO.getPageOfFollows(
            userAlias,
            User.fromDto(lastItem),
            pageSize,
            followers
        );
        const dtos = page.values.map((user) => user.dto);
        return [dtos, page.hasMorePages];
    }
}
