import { User } from "tweeter-shared";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    BatchWriteCommand,
    BatchWriteCommandInput,
    BatchWriteCommandOutput,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcryptjs";

class FillUserTableDao {
    //
    // Modify these values as needed to match your user table.
    //
    private readonly tableName = "users";
    private readonly userAliasAttribute = "user_handle";
    private readonly userFirstNameAttribute = "firstName";
    private readonly userLastNameAttribute = "lastName";
    private readonly userImageUrlAttribute = "imageUrl";
    private readonly passwordHashAttribute = "password";
    private readonly followeeCountAttribute = "followees";
    private readonly followerCountAttribute = "followers";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async createUsers(userList: User[], password: string) {
        if (userList.length == 0) {
            console.log("zero followers to batch write");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const params = {
            RequestItems: {
                [this.tableName]: this.createPutUserRequestItems(
                    userList,
                    hashedPassword
                ),
            },
        };

        try {
            const resp = await this.client.send(new BatchWriteCommand(params));
            await this.putUnprocessedItems(resp, params);
        } catch (err) {
            throw new Error(
                `Error while batch writing users with params: ${params}: \n${err}`
            );
        }
    }

    private createPutUserRequestItems(
        userList: User[],
        hashedPassword: string
    ) {
        return userList.map((user) =>
            this.createPutUserRequest(user, hashedPassword)
        );
    }

    private createPutUserRequest(user: User, hashedPassword: string) {
        const item = {
            [this.userAliasAttribute]: user.alias,
            [this.userFirstNameAttribute]: user.firstName,
            [this.userLastNameAttribute]: user.lastName,
            [this.passwordHashAttribute]: hashedPassword,
            [this.userImageUrlAttribute]: user.imageUrl,
            [this.followerCountAttribute]: 0,
            [this.followeeCountAttribute]: 1,
        };

        return {
            PutRequest: {
                Item: item,
            },
        };
    }

    private async putUnprocessedItems(
        resp: BatchWriteCommandOutput,
        params: BatchWriteCommandInput
    ) {
        let delay = 10;
        let attempts = 0;

        while (
            resp.UnprocessedItems !== undefined &&
            Object.keys(resp.UnprocessedItems).length > 0
        ) {
            attempts++;

            if (attempts > 1) {
                // Pause before the next attempt
                await new Promise((resolve) => setTimeout(resolve, delay));

                // Increase pause time for next attempt
                if (delay < 1000) {
                    delay += 100;
                }
            }

            console.log(
                `Attempt ${attempts}. Processing ${
                    Object.keys(resp.UnprocessedItems).length
                } unprocessed users.`
            );

            params.RequestItems = resp.UnprocessedItems;
            resp = await this.client.send(new BatchWriteCommand(params));
        }
    }

    async increaseFollowersCount(
        alias: string,
        count: number
    ): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: { [this.userAliasAttribute]: alias },
            ExpressionAttributeValues: { ":inc": count },
            UpdateExpression:
                "SET " +
                this.followerCountAttribute +
                " = " +
                this.followerCountAttribute +
                " + :inc",
        };

        try {
            await this.client.send(new UpdateCommand(params));
            return true;
        } catch (err) {
            console.error("Error while updating followers count:", err);
            return false;
        }
    }
}
class FillFollowTableDao {
    //
    // Modify these values as needed to match your follow table.
    //
    private readonly tableName = "follows";
    private readonly followerAliasAttribute = "follower_handle";
    private readonly followeeAliasAttribute = "followee_handle";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async createFollows(followeeAlias: string, followerAliasList: string[]) {
        if (followerAliasList.length == 0) {
            console.log("Zero followers to batch write");
            return;
        } else {
            const params = {
                RequestItems: {
                    [this.tableName]: this.createPutFollowRequestItems(
                        followeeAlias,
                        followerAliasList
                    ),
                },
            };

            try {
                const response = await this.client.send(
                    new BatchWriteCommand(params)
                );
                await this.putUnprocessedItems(response, params);
            } catch (err) {
                throw new Error(
                    `Error while batch writing follows with params: ${params} \n${err}`
                );
            }
        }
    }

    private createPutFollowRequestItems(
        followeeAlias: string,
        followerAliasList: string[]
    ) {
        return followerAliasList.map((followerAlias) =>
            this.createPutFollowRequest(followerAlias, followeeAlias)
        );
    }

    private createPutFollowRequest(
        followerAlias: string,
        followeeAlias: string
    ) {
        const item = {
            [this.followerAliasAttribute]: followerAlias,
            [this.followeeAliasAttribute]: followeeAlias,
        };

        return {
            PutRequest: {
                Item: item,
            },
        };
    }

    private async putUnprocessedItems(
        resp: BatchWriteCommandOutput,
        params: BatchWriteCommandInput
    ) {
        let delay = 10;
        let attempts = 0;

        while (
            resp.UnprocessedItems !== undefined &&
            Object.keys(resp.UnprocessedItems).length > 0
        ) {
            attempts++;

            if (attempts > 1) {
                // Pause before the next attempt
                await new Promise((resolve) => setTimeout(resolve, delay));

                // Increase pause time for next attempt
                if (delay < 1000) {
                    delay += 100;
                }
            }

            console.log(
                `Attempt ${attempts}. Processing ${
                    Object.keys(resp.UnprocessedItems).length
                } unprocessed follow items.`
            );

            params.RequestItems = resp.UnprocessedItems;
            resp = await this.client.send(new BatchWriteCommand(params));
        }
    }
}

const mainUsername = "@daisy";
const baseFollowerAlias = "@donald";
const followerPassword = "password";
const followerImageUrl =
    "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
const baseFollowerFirstName = "Donald";
const baseFollowerLastName = "Duck";

const numbUsersToCreate = 100;
const numbFollowsToCreate = numbUsersToCreate;
const batchSize = 25;
const aliasList: string[] = Array.from(
    { length: numbUsersToCreate },
    (_, i) => baseFollowerAlias + (i + 1)
);

const fillUserTableDao = new FillUserTableDao();
const fillFollowTableDao = new FillFollowTableDao();

main();

async function main() {
    console.log("Creating users");
    await createUsers(0);

    console.log("Creating follows");
    await createFollows(0);

    console.log("Increasing the followee's followers count");
    await fillUserTableDao.increaseFollowersCount(
        mainUsername,
        numbUsersToCreate
    );

    console.log("Done!");
}

async function createUsers(createdUserCount: number) {
    const userList = createUserList(createdUserCount);
    await fillUserTableDao.createUsers(userList, followerPassword);

    createdUserCount += batchSize;

    if (createdUserCount % 1000 == 0) {
        console.log(`Created ${createdUserCount} users`);
    }

    if (createdUserCount < numbUsersToCreate) {
        await createUsers(createdUserCount);
    }
}

function createUserList(createdUserCount: number) {
    const users: User[] = [];

    // Ensure that we start at alias 1 rather than alias 0.
    const start = createdUserCount + 1;
    const limit = start + batchSize;

    for (let i = start; i < limit; ++i) {
        let user = new User(
            `${baseFollowerFirstName}_${i}`,
            `${baseFollowerLastName}_${i}`,
            `${baseFollowerAlias}${i}`,
            followerImageUrl
        );

        users.push(user);
    }

    return users;
}

async function createFollows(createdFollowsCount: number) {
    const followList = aliasList.slice(
        createdFollowsCount,
        createdFollowsCount + batchSize
    );

    await fillFollowTableDao.createFollows(mainUsername, followList);

    createdFollowsCount += batchSize;

    if (createdFollowsCount % 1000 == 0) {
        console.log(`Created ${createdFollowsCount} follows`);
    }

    if (createdFollowsCount < numbFollowsToCreate) {
        await createFollows(createdFollowsCount);
    }
}
