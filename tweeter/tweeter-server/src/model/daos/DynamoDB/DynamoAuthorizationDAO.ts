import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";
import { AuthorizationDAO } from "../AuthorizationDAO";

export class DynamoAuthorizationDAO implements AuthorizationDAO {
    private readonly tableName = "tokens";
    private readonly tokenKey = "token";
    private readonly aliasKey = "user_handle";
    private readonly timestampKey = "timestap";

    private readonly deltaTime = 600000;

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async checkToken(token: string): Promise<boolean> {
        const checkParams = {
            TableName: this.tableName,
            Key: { [this.tokenKey]: token },
        };
        const checkResult = await this.client.send(new GetCommand(checkParams));

        if (checkResult.Item == undefined) {
            return false;
        }

        const currentTime = Date.now();

        if (
            currentTime - checkResult.Item[this.timestampKey] >
            this.deltaTime
        ) {
            await this.deleteToken(token);
            return false;
        }

        const updateParams = {
            TableName: this.tableName,
            Key: { [this.tokenKey]: token },
            UpdateExpression: "SET #v = :v",
            ExpressionAttributeNames: { "#v": this.timestampKey },
            ExpressionAttributeValues: { ":v": currentTime },
        };
        await this.client.send(new UpdateCommand(updateParams));

        return true;
    }

    public async deleteToken(token: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: { [this.tokenKey]: token },
        };
        await this.client.send(new DeleteCommand(params));
    }

    public async addToken(token: AuthToken, alias: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.tokenKey]: token.token,
                [this.timestampKey]: token.timestamp,
                [this.aliasKey]: alias,
            },
        };
        await this.client.send(new PutCommand(params));
    }

    public async getAliasFromToken(token: string): Promise<string> {
        const params = {
            TableName: this.tableName,
            Key: { [this.tokenKey]: token },
        };
        const response = await this.client.send(new GetCommand(params));

        return response.Item == undefined ? "" : response.Item[this.aliasKey];
    }
}
