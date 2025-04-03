import { Status, StatusDto } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";
import { DataPage } from "../../entity/DataPage";

export class DynamoStatusDAO implements StatusDAO {
    public async getPageOfStatus(
        alias: string,
        lastItem: Status | null,
        pageSize: number,
        feed: boolean
    ): Promise<DataPage<Status>> {
        return;
    }
    public async postStatus(status: StatusDto, alias: string): Promise<void> {}
}
