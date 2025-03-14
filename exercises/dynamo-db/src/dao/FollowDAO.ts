import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Follow } from "../entity/Follow";
import { DataPage } from "../entity/DataPage";

export class FollowDAO {
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly followerKey = "follower_handle";
    readonly followeeKey = "followee_handle";
    readonly followerAttr = "follower_name";
    readonly followeeAttr = "followee_name";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    // put a new follower
    async putFollow(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerKey]: follow.follower_handle,
                [this.followerAttr]: follow.follower_name,
                [this.followeeKey]: follow.followee_handle,
                [this.followeeAttr]: follow.followee_name,
            },
        };
        await this.client.send(new PutCommand(params));
    }

    // update a follower
    async updateFollow(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
            UpdateExpression:
                "SET #follower_name = :follower_name, #followee_name = :followee_name",
            ExpressionAttributeNames: {
                "#follower_name": this.followerAttr,
                "#followee_name": this.followeeAttr,
            },
            ExpressionAttributeValues: {
                ":follower_name": follow.follower_name,
                ":followee_name": follow.followee_name,
            },
        };
        await this.client.send(new UpdateCommand(params));
    }

    // grab a follower
    async getFollow(follow: Follow): Promise<Follow | undefined> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
            ? undefined
            : new Follow(
                  output.Item[this.followerKey],
                  output.Item[this.followerAttr],
                  output.Item[this.followeeKey],
                  output.Item[this.followeeAttr]
              );
    }

    // delete a follower
    async deleteFollow(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: this.generateFollowItem(follow),
        };
        await this.client.send(new DeleteCommand(params));
    }

    // generate a key
    private generateFollowItem(follow: Follow) {
        return {
            [this.followerKey]: follow.follower_handle,
            [this.followeeKey]: follow.followee_handle,
        };
    }

    // get paged followees
    async getPageOfFollowees(
        followerHandle: string,
        lastFolloweeHandle: string | undefined = undefined,
        pageSize: number = 5
    ): Promise<DataPage<Follow>> {
        const params = {
            KeyConditionExpression: "#v = :v",
            ExpressionAttributeNames: {
                "#v": this.followerKey,
            },
            ExpressionAttributeValues: {
                ":v": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFolloweeHandle === undefined
                    ? undefined
                    : {
                          [this.followerKey]: followerHandle,
                          [this.followeeKey]: lastFolloweeHandle,
                      },
        };

        const items: Follow[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new Follow(
                    item[this.followerKey],
                    item[this.followerAttr],
                    item[this.followeeKey],
                    item[this.followeeAttr]
                )
            )
        );

        return new DataPage<Follow>(items, hasMorePages);
    }

    // get paged followers
    async getPageOfFollowers(
        followeeHandle: string,
        lastFollowerHandle: string | undefined = undefined,
        pageSize: number = 5
    ): Promise<DataPage<Follow>> {
        const params = {
            KeyConditionExpression: "#v = :v",
            ExpressionAttributeNames: {
                "#v": this.followeeKey,
            },
            ExpressionAttributeValues: {
                ":v": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFollowerHandle === undefined
                    ? undefined
                    : {
                          [this.followerKey]: lastFollowerHandle,
                          [this.followeeKey]: followeeHandle,
                      },
        };

        const items: Follow[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) =>
            items.push(
                new Follow(
                    item[this.followerKey],
                    item[this.followerAttr],
                    item[this.followeeKey],
                    item[this.followeeAttr]
                )
            )
        );

        return new DataPage<Follow>(items, hasMorePages);
    }
}
