import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status, StatusDto, User } from "tweeter-shared";
import { StatusDAO } from "../StatusDAO";
import { DataPage } from "../../entity/DataPage";

export class DynamoStatusDAO implements StatusDAO {
    private readonly storyTableName = "stories";
    private readonly feedTableName = "feeds";
    private readonly userTableName = "user";
    private readonly followTableName = "follows";

    private readonly primaryKey = "user_handle";
    private readonly secondaryKey = "timestamp";
    private readonly postAttr = "post";

    private readonly userKey = "user_handle";
    private readonly firstNameAttr = "firstName";
    private readonly lastNameAttr = "lastName";
    private readonly imageUrlAttr = "imageUrl";

    private readonly followerKey = "follower_handle";
    private readonly followeeKey = "followee_handle";
    private readonly indexName = "follows_index";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async getPageOfStatus(
        alias: string,
        lastItem: Status | null,
        pageSize: number,
        feed: boolean
    ): Promise<DataPage<Status>> {
        const statusParams = {
            KeyConditionExpression: "#v = :v",
            ExpressionAttributeNames: { "#v": this.primaryKey },
            ExpressionAttributeValues: { ":v": alias },
            TableName: feed ? this.feedTableName : this.storyTableName,
            Limit: pageSize,
            ScanIndexForward: false,
            ExclusiveStartKey:
                lastItem === null
                    ? undefined
                    : {
                          [this.primaryKey]: alias,
                          [this.secondaryKey]: lastItem.timestamp,
                      },
        };
        const statusData = await this.client.send(
            new QueryCommand(statusParams)
        );
        const hasMorePages = statusData.LastEvaluatedKey !== undefined;

        const items: Status[] = [];

        let user = await this.getOneUser(alias);

        statusData.Items?.forEach(async (item) => {
            if (feed) user = await this.getOneUser(item[this.primaryKey]);

            items.push(
                new Status(item[this.postAttr], user, item[this.secondaryKey])
            );
        });

        return new DataPage<Status>(items, hasMorePages);
    }

    private async getOneUser(alias: string): Promise<User> {
        const userParams = {
            TableName: this.userTableName,
            Key: { [this.userKey]: alias },
        };

        const userData = await this.client.send(new GetCommand(userParams));

        return new User(
            userData.Item?.[this.firstNameAttr],
            userData.Item?.[this.lastNameAttr],
            userData.Item?.[this.userKey],
            userData.Item?.[this.imageUrlAttr]
        );
    }

    public async postStatus(status: StatusDto, alias: string): Promise<void> {
        const userParams = {
            TableName: this.storyTableName,
            Item: {
                [this.primaryKey]: alias,
                [this.secondaryKey]: status.timestamp,
                [this.postAttr]: status.post,
            },
        };
        await this.client.send(new PutCommand(userParams));

        const followerParams = {
            KeyConditionExpression: "#v = :v",
            ExpressionAttributeNames: {
                "#v": this.followeeKey,
            },
            ExpressionAttributeValues: {
                ":v": alias,
            },
            TableName: this.followTableName,
            IndexName: this.indexName,
        };
        const data = await this.client.send(new QueryCommand(followerParams));

        data.Items?.forEach(async (item) => {
            const params = {
                TableName: this.followTableName,
                Item: {
                    [this.primaryKey]: item[this.followerKey],
                    [this.secondaryKey]: status.timestamp,
                    [this.postAttr]: status.post,
                },
            };
            await this.client.send(new PutCommand(params));
        });
    }
}
