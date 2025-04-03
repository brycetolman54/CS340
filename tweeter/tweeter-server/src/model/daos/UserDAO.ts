import { User } from "tweeter-shared";

export interface UserDAO {
    getUser: (alias: string) => Promise<User | null>;
    getUserWithPassword: (alias: string, password: string) => Promise<User>;
    isFollower: (
        userAlias: string,
        selectedUserAlias: string
    ) => Promise<boolean>;
    checkPassword: (alias: string, password: string) => Promise<boolean>;
    createUser: (
        firstName: string,
        lastName: string,
        alias: string,
        password: string
    ) => Promise<User | null>;
}
