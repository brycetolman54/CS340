import { StatusDto, Status, FakeData } from "tweeter-shared";
import { FactoryDAO } from "../daos/FactoryDAO";
import { StatusDAO } from "../daos/StatusDAO";
import { UserDAO } from "../daos/UserDAO";

export class StatusService {
    private factory: FactoryDAO;
    private userDAO: UserDAO;
    private statusDAO: StatusDAO;

    public constructor(factory: FactoryDAO) {
        this.factory = factory;
        this.userDAO = factory.getUserDAO();
        this.statusDAO = factory.getStatusDAO();
    }

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize);
    }

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize);
    }

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        await new Promise((f) => setTimeout(f, 2000));
    }

    private async getFakeData(
        lastItem: StatusDto | null,
        pageSize: number
    ): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(
            Status.fromDto(lastItem),
            pageSize
        );
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    }
}
