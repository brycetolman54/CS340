import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const sqsClient = new SQSClient();
const sqsUrl = "https://sqs.us-east-1.amazonaws.com/745138876849/JobsQ";

const tableName = "follows";
const followerKey = "follower_handle";
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

        if (data.Items == undefined) {
            return;
        }

        const numFollowers = data.Items.length;
        const batchSize = Math.ceil(numFollowers / 10);

        // send batches to the next q
        for (let i = 0; i < numFollowers; i += batchSize) {
            const batchOfUsers = [];
            for (let j = i; j < batchSize; j++) {
                if (i + j < numFollowers) {
                    batchOfUsers.push(data.Items[i][followerKey]);
                }
            }
            const messageBody = JSON.stringify({
                poster: alias,
                post: post,
                timestamp: timestamp,
                followers: batchOfUsers,
            });
            const params = {
                QueueUrl: sqsUrl,
                MessageBody: messageBody,
            };
            sqsClient.send(new SendMessageCommand(params));
        }
    }
};
