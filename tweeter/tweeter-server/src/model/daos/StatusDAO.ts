import { Status, StatusDto } from "tweeter-shared";

export interface StatusDAO {
    getPageOfFeed: (
        alias: string,
        lastItem: Status | null,
        pageSize: number
    ) => Promise<[Status[], boolean]>;
    getPageOfStory: (
        alias: string,
        lastItem: Status | null,
        pageSize: number
    ) => Promise<[Status[], boolean]>;
    postStatus: (status: StatusDto, alias: string) => Promise<void>;
}
