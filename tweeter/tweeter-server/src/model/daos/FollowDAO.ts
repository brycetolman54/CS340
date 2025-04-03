export interface FollowDAO {
    getFollowerCount: (alias: string) => Promise<number>;
    getFolloweeCount: (alias: string) => Promise<number>;
}
