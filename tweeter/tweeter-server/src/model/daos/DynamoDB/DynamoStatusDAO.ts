import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Status, StatusDto, User } from "tweeter-shared";
import { StatusDAO } from "../general/StatusDAO";
import { DataPage } from "../../entity/DataPage";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient();
const sqsUrl = "https://sqs.us-east-1.amazonaws.com/745138876849/PostsQ";

export class DynamoStatusDAO implements StatusDAO {
    private readonly storyTableName = "stories";
    private readonly feedTableName = "feeds";
    private readonly userTableName = "users";

    private readonly primaryKey = "user_handle";
    private readonly secondaryKey = "timestamp";
    private readonly postAttr = "post";
    private readonly posterKey = "poster_handle";

    private readonly userKey = "user_handle";
    private readonly firstNameAttr = "firstName";
    private readonly lastNameAttr = "lastName";
    private readonly imageUrlAttr = "imageUrl";

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

        for (const item of statusData.Items || []) {
            if (feed) user = await this.getOneUser(item[this.posterKey]);

            items.push(
                new Status(item[this.postAttr], user, item[this.secondaryKey])
            );
        }

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

        const messageBody = JSON.stringify({
            alias: alias,
            post: status.post,
            timestamp: status.timestamp,
        });

        const params = {
            QueueUrl: sqsUrl,
            MessageBody: messageBody,
        };

        sqsClient.send(new SendMessageCommand(params));
    }
}
