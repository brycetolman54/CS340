import { StatusDto, Status } from "tweeter-shared";
import { FactoryDAO } from "../daos/FactoryDAO";
import { StatusDAO } from "../daos/StatusDAO";
import { Service } from "./Service";

export class StatusService extends Service {
    private statusDAO: StatusDAO;

    public constructor(factory: FactoryDAO) {
        super(factory);
        this.statusDAO = factory.getStatusDAO();
    }

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.checkToken(token);

        const [items, hasMore] = await this.statusDAO.getPageOfFeed(
            userAlias,
            Status.fromDto(lastItem),
            pageSize
        );

        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    }

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.checkToken(token);

        const [items, hasMore] = await this.statusDAO.getPageOfStory(
            userAlias,
            Status.fromDto(lastItem),
            pageSize
        );

        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    }

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        await this.checkToken(token);

        const alias = await this.authorizationDAO.getAliasFromToken(token);

        await this.statusDAO.postStatus(newStatus, alias);
    }
}
