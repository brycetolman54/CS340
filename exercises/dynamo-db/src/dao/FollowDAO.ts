import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Follow } from "../entity/Follow";

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
}
