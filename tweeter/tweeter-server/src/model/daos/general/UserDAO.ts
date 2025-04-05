import { User } from "tweeter-shared";

export interface UserDAO {
    getUser: (alias: string) => Promise<User | null>;
    getUserWithPassword: (
        alias: string,
        password: string
    ) => Promise<User | null>;
    isFollower: (
        userAlias: string,
        selectedUserAlias: string
    ) => Promise<boolean>;
    createUser: (
        firstName: string,
        lastName: string,
        alias: string,
        password: string
    ) => Promise<User | null>;
    updateImageURL: (alias: string, imageUrl: string) => Promise<void>;
}
