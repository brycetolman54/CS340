import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../net/ServerFacade";

export class UserService {
    private serverFacade = new ServerFacade();

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        return await this.serverFacade.getUser({
            token: authToken.token,
            alias: alias,
        });
    }

    public async logout(authToken: AuthToken): Promise<void> {
        return await this.serverFacade.logout({
            token: authToken.token,
        });
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        return await this.serverFacade.login({
            alias: alias,
            password: password,
        });
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        const imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");

        return await this.serverFacade.register({
            firstName: firstName,
            lastName: lastName,
            alias: alias,
            password: password,
            imageStringBase64: imageStringBase64,
            imageFileExtension: imageFileExtension,
        });
    }

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        return await this.serverFacade.unfollow({
            token: authToken.token,
            user: userToUnfollow.dto,
        });
    }

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        return await this.serverFacade.follow({
            token: authToken.token,
            user: userToFollow.dto,
        });
    }

    public async getFollowerCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        return await this.serverFacade.getFollowerCount({
            token: authToken.token,
            user: user.dto,
        });
    }

    public async getFolloweeCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        return await this.serverFacade.getFolloweeCount({
            token: authToken.token,
            user: user.dto,
        });
    }

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        return await this.serverFacade.getIsFollowerStatus({
            token: authToken.token,
            user: user.dto,
            selectedUser: selectedUser.dto,
        });
    }
}
