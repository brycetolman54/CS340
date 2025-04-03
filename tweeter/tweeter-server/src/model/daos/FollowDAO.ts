import { User } from "tweeter-shared";

export interface FollowDAO {
    getFollowerCount: (alias: string) => Promise<number>;
    getFolloweeCount: (alias: string) => Promise<number>;
    getPageOfFollowers: (
        alias: string,
        lastItem: User | null,
        pageSize: number
    ) => Promise<[User[], boolean]>;
    getPageOfFollowees: (
        alias: string,
        lastItem: User | null,
        pageSize: number
    ) => Promise<[User[], boolean]>;
}
