import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const tableName = "feeds";

const primaryKey = "user_handle";
const secondaryKey = "timestamp";
const postAttr = "post";
const posterKey = "poster_handle";

const client = DynamoDBDocumentClient.from(new DynamoDBClient());

export const handler = async function (event: any) {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        const poster = body.poster;
        const post = body.post;
        const timestamp = body.timestamp;
        const followers = body.followers;

        for (const follower of followers) {
            const params = {
                TableName: tableName,
                Item: {
                    [primaryKey]: follower,
                    [secondaryKey]: timestamp,
                    [postAttr]: post,
                    [posterKey]: poster,
                },
            };
            await client.send(new PutCommand(params));
        }
    }
};
