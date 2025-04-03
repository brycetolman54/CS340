import { AuthToken } from "tweeter-shared";
import { AuthorizationDAO } from "../AuthorizationDAO";

export class DynamoAuthorizationDAO implements AuthorizationDAO {
    public async checkToken(token: string): Promise<boolean> {
        return true;
    }

    public async deleteToken(token: string): Promise<void> {
        return;
    }

    public async addToken(token: AuthToken, alias: string): Promise<void> {
        return;
    }

    public async getUserFromToken(token: string): Promise<string> {
        return "";
    }
}
