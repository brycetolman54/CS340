import { User } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";

export interface FollowDAO {
    getFollowCount: (alias: string, followers: boolean) => Promise<number>;
    getPageOfFollows: (
        alias: string,
        lastItem: User | null,
        pageSize: number,
        followers: boolean
    ) => Promise<DataPage<User>>;
    addFollow: (alias: string, userToFollowAlias: string) => Promise<void>;
    deleteFollow: (alias: string, userToFollowAlias: string) => Promise<void>;
}
