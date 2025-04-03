import { AuthToken } from "tweeter-shared";

export interface AuthorizationDAO {
    checkToken: (token: string) => Promise<boolean>;
    deleteToken: (token: string) => Promise<void>;
    addToken: (token: AuthToken, alias: string) => Promise<void>;
    getAliasFromToken: (token: string) => Promise<string>;
}
