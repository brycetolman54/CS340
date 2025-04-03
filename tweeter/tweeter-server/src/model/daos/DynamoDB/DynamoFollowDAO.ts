import { FollowDAO } from "../FollowDAO";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    // UpdateCommand,
    QueryCommand,
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
            Key: {
                [this.userKey]: alias,
            },
        };
        const output = await this.client.send(new GetCommand(params));
        if (output.Item == undefined) {
            throw new Error("dynamodb get failed to find user");
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
        const params = followers
            ? this.getFollowerParams(alias, lastItem, pageSize)
            : this.getFolloweeParams(alias, lastItem, pageSize);

        const items: User[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
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

    private getFollowerParams(
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

    private getFolloweeParams(
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
                          [this.followerKey]: alias,
                          [this.followeeKey]: lastItem.alias,
                      },
        };
    }
}
