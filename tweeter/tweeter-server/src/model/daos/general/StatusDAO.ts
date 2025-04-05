import { Status, StatusDto } from "tweeter-shared";
import { DataPage } from "../../entity/DataPage";

export interface StatusDAO {
    getPageOfStatus: (
        alias: string,
        lastItem: Status | null,
        pageSize: number,
        feed: boolean
    ) => Promise<DataPage<Status>>;
    postStatus: (status: StatusDto, alias: string) => Promise<void>;
}
