import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const sqsClient = new SQSClient();
const sqsUrl = "https://sqs.us-east-1.amazonaws.com/745138876849/JobsQ";

const tableName = "follows";
const followeeKey = "followee_handle";
const indexName = "follows_index";

export const handler = async function (event: any) {
    for (const record of event.Records) {
        const body = JSON.parse(record.body);
        const alias = body.alias;
        const post = body.post;
        const timestamp = body.timestamp;

        const followerParams = {
            KeyConditionExpression: "#v = :v",
            ExpressionAttributeNames: {
                "#v": followeeKey,
            },
            ExpressionAttributeValues: {
                ":v": alias,
            },
            TableName: tableName,
            IndexName: indexName,
        };
        const data = await dynamoClient.send(new QueryCommand(followerParams));

        const numFollowers =
            data.Items?.length == undefined ? 0 : data.Items.length;

        // send batches of 1000 to the next q
        for (let i = 0; i < numFollowers; i += 1000) {
            const batchOfUsers = [];
            data.Items[i];
        }
    }
};
