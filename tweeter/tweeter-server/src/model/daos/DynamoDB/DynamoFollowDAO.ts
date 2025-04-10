import { FollowDAO } from "../general/FollowDAO";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    BatchGetCommand,
    QueryCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DataPage } from "../../entity/DataPage";
import { User } from "tweeter-shared";

export class DynamoFollowDAO implements FollowDAO {
    private readonly followTableName = "follows";
    private readonly indexName = "follows_index";
    private readonly followerKey = "follower_handle";
    private readonly followeeKey = "followee_handle";

    private readonly userTableName = "users";
    private readonly userKey = "user_handle";
    private readonly followersKey = "followers";
    private readonly followeesKey = "followees";

    private readonly firstNameAttr = "firstName";
    private readonly lastNameAttr = "lastName";
    private readonly imageUrlAttr = "imageUrl";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    // put a new follower
    public async addFollow(
        alias: string,
        userToFollowAlias: string
    ): Promise<void> {
        const params = {
            TableName: this.followTableName,
            Item: this.generateFollowItem(alias, userToFollowAlias),
        };
        await this.client.send(new PutCommand(params));

        await this.updateCount(alias, userToFollowAlias, 1);
    }

    // delete a follower
    public async deleteFollow(
        alias: string,
        userToUnfollowAlias: string
    ): Promise<void> {
        const params = {
            TableName: this.followTableName,
            Key: this.generateFollowItem(alias, userToUnfollowAlias),
        };
        await this.client.send(new DeleteCommand(params));

        await this.updateCount(alias, userToUnfollowAlias, -1);
    }

    private async updateCount(
        alias1: string,
        alias2: string,
        val: number
    ): Promise<void> {
        const updateAlias1Params = {
            TableName: this.userTableName,
            Key: { [this.userKey]: alias1 },
            UpdateExpression: "ADD #v :v",
            ExpressionAttributeNames: { "#v": this.followeesKey },
            ExpressionAttributeValues: { ":v": val },
        };
        await this.client.send(new UpdateCommand(updateAlias1Params));

        const updateAlias2Params = {
            TableName: this.userTableName,
            Key: { [this.userKey]: alias2 },
            UpdateExpression: "ADD #v :v",
            ExpressionAttributeNames: { "#v": this.followersKey },
            ExpressionAttributeValues: { ":v": val },
        };
        await this.client.send(new UpdateCommand(updateAlias2Params));
    }

    // generate a key
    private generateFollowItem(alias: string, alias2: string) {
        return {
            [this.followerKey]: alias,
            [this.followeeKey]: alias2,
        };
    }

    public async getFollowCount(
        alias: string,
        followers: boolean
    ): Promise<number> {
        const params = {
            TableName: this.userTableName,
            Key: { [this.userKey]: alias },
        };
        const output = await this.client.send(new GetCommand(params));
        if (output.Item == undefined) {
            throw new Error("[Server Error] dynamodb get failed to find user");
        }
        return output.Item[followers ? this.followersKey : this.followeesKey];
    }

    // get paged followees
    public async getPageOfFollows(
        alias: string,
        lastItem: User | null,
        pageSize: number,
        followers: boolean
    ): Promise<DataPage<User>> {
        const aliasParams = followers
            ? this.getFollowerParams(alias, lastItem, pageSize)
            : this.getFolloweeParams(alias, lastItem, pageSize);
        const aliasData = await this.client.send(new QueryCommand(aliasParams));
        const hasMorePages = aliasData.LastEvaluatedKey !== undefined;

        if (aliasData.Items?.length == 0) {
            return new DataPage<User>([], hasMorePages);
        }

        const userKeys = aliasData.Items?.map((item) => {
            return followers
                ? { [this.userKey]: item[this.followerKey] }
                : { [this.userKey]: item[this.followeeKey] };
        });
        const userParams = {
            RequestItems: {
                [this.userTableName]: {
                    Keys: userKeys,
                },
            },
        };
        const userData = await this.client.send(
            new BatchGetCommand(userParams)
        );

        const items: User[] = [];
        userData.Responses?.[this.userTableName].forEach((item) =>
            items.push(
                new User(
                    item[this.firstNameAttr],
                    item[this.lastNameAttr],
                    item[this.userKey],
                    item[this.imageUrlAttr]
                )
            )
        );

        return new DataPage<User>(items, hasMorePages);
    }

    private getFolloweeParams(
        alias: string,
        lastItem: User | null,
        pageSize: number
    ) {
        return {
            KeyConditionExpression: "#v = :v",
            ExpressionAttributeNames: {
                "#v": this.followerKey,
            },
            ExpressionAttributeValues: {
                ":v": alias,
            },
            TableName: this.followTableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastItem === null
                    ? undefined
                    : {
                          [this.followerKey]: alias,
                          [this.followeeKey]: lastItem.alias,
                      },
        };
    }

    private getFollowerParams(
        alias: string,
        lastItem: User | null,
        pageSize: number
    ) {
        return {
            KeyConditionExpression: "#v = :v",
            ExpressionAttributeNames: {
                "#v": this.followeeKey,
            },
            ExpressionAttributeValues: {
                ":v": alias,
            },
            TableName: this.followTableName,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastItem === null
                    ? undefined
                    : {
                          [this.followerKey]: lastItem.alias,
                          [this.followeeKey]: alias,
                      },
        };
    }
}
