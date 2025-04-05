import { StatusDto, Status } from "tweeter-shared";
import { FactoryDAO } from "../daos/general/FactoryDAO";
import { StatusDAO } from "../daos/general/StatusDAO";
import { Service } from "./Service";

export class StatusService extends Service {
    private statusDAO: StatusDAO;

    public constructor(factory: FactoryDAO) {
        super(factory);
        this.statusDAO = factory.getStatusDAO();
    }

    public async loadMoreStatusItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null,
        feed: boolean
    ): Promise<[StatusDto[], boolean]> {
        await this.checkToken(token);

        const page = await this.statusDAO.getPageOfStatus(
            userAlias,
            Status.fromDto(lastItem),
            pageSize,
            feed
        );

        const dtos = page.values.map((status) => status.dto);
        return [dtos, page.hasMorePages];
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
