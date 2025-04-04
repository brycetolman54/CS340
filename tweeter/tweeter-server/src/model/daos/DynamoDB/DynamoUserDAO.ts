import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { User } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import bcrypt from "bcryptjs";

export class DynamoUserDAO implements UserDAO {
    private readonly userTableName = "users";
    private readonly followTableName = "follows";

    private readonly userKey = "user_handle";
    private readonly firstNameAttr = "firstName";
    private readonly lastNameAttr = "lastName";
    private readonly imageUrlAttr = "imageUrl";
    private readonly passwordAttr = "password";

    private readonly followerKey = "follower_handle";
    private readonly followeeKey = "followee_handle";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async getUser(alias: string): Promise<User | null> {
        const user = await this.grabUser(alias);
        return user == undefined
            ? null
            : new User(
                  user[this.firstNameAttr],
                  user[this.lastNameAttr],
                  user[this.userKey],
                  user[this.imageUrlAttr]
              );
    }

    public async getUserWithPassword(
        alias: string,
        password: string
    ): Promise<User | null> {
        const user = await this.grabUser(alias);

        if (
            user == undefined ||
            !bcrypt.compareSync(password, user[this.passwordAttr])
        ) {
            return null;
        }

        return new User(
            user[this.firstNameAttr],
            user[this.lastNameAttr],
            user[this.userKey],
            user[this.imageUrlAttr]
        );
    }

    public async isFollower(
        userAlias: string,
        selectedUserAlias: string
    ): Promise<boolean> {
        const params = {
            TableName: this.followTableName,
            Key: {
                [this.followerKey]: userAlias,
                [this.followeeKey]: selectedUserAlias,
            },
        };
        const resp = await this.client.send(new GetCommand(params));

        return resp.Item == undefined ? false : true;
    }

    public async createUser(
        firstName: string,
        lastName: string,
        alias: string,
        password: string
    ): Promise<User | null> {
        if ((await this.grabUser(alias)) != undefined) {
            return null;
        }

        const hash = bcrypt.hashSync(password, 10);

        const params = {
            TableName: this.userTableName,
            Item: {
                [this.userKey]: alias,
                [this.firstNameAttr]: firstName,
                [this.lastNameAttr]: lastName,
                [this.imageUrlAttr]: "",
                [this.passwordAttr]: hash,
            },
        };
        await this.client.send(new PutCommand(params));

        return new User(firstName, lastName, alias, "");
    }

    public async updateImageURL(
        alias: string,
        imageUrl: string
    ): Promise<void> {
        const params = {
            TableName: this.userTableName,
            Key: { [this.userKey]: alias },
            UpdateExpression: "SET #v = :v",
            ExpressionAttributeNames: { "#v": this.imageUrlAttr },
            ExpressionAttributeValues: { ":v": imageUrl },
        };
        await this.client.send(new UpdateCommand(params));
    }

    private async grabUser(
        alias: string
    ): Promise<Record<string, any> | undefined> {
        const params = {
            TableName: this.userTableName,
            Key: { [this.userKey]: alias },
        };
        const user = await this.client.send(new GetCommand(params));
        return user.Item;
    }
}
