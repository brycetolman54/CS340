import { UserDto, AuthTokenDto, AuthToken } from "tweeter-shared";
import { followerHandler } from "../../lambda/follow/GetFollowerCountLambda";
import { followeeHandler } from "../../lambda/follow/GetFolloweeCountLambda";
import { FactoryDAO } from "../daos/FactoryDAO";
import { UserDAO } from "../daos/UserDAO";
import { FollowDAO } from "../daos/FollowDAO";
import { Service } from "./Service";

export class UserService extends Service {
    private userDAO: UserDAO;
    private followDAO: FollowDAO;

    public constructor(factory: FactoryDAO) {
        super(factory);
        this.userDAO = factory.getUserDAO();
        this.followDAO = factory.getFollowDAO();
    }

    public async getUser(
        token: string,
        alias: string
    ): Promise<UserDto | null> {
        await this.checkToken(token);
        const user = await this.userDAO.getUser(alias);
        return user == null ? null : user.dto;
    }

    public async logout(token: string): Promise<void> {
        await this.authorizationDAO.deleteToken(token);
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[UserDto, AuthTokenDto]> {
        const user = await this.userDAO.getUserWithPassword(alias, password);

        if (user === null) {
            throw new Error("Invalid alias or password");
        }

        const token = AuthToken.Generate();
        this.authorizationDAO.addToken(token, alias);

        return [user.dto, token.dto];
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageStringBase64: string,
        imageFileExtension: string
    ): Promise<[UserDto, AuthTokenDto]> {
        let user = await this.userDAO.createUser(
            firstName,
            lastName,
            alias,
            password,
            imageStringBase64,
            imageFileExtension
        );

        if (user === null) {
            throw new Error("Invalid registration");
        }

        const token = AuthToken.Generate();
        this.authorizationDAO.addToken(token, alias);

        return [user.dto, token.dto];
    }

    public async unfollow(
        token: string,
        userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const followerCount = await followerHandler({
            token: token,
            user: userToUnfollow,
        });
        const followeeCount = await followeeHandler({
            token: token,
            user: userToUnfollow,
        });

        return [followerCount.count, followeeCount.count];
    }

    public async follow(
        token: string,
        userToFollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const followerCount = await followerHandler({
            token: token,
            user: userToFollow,
        });
        const followeeCount = await followeeHandler({
            token: token,
            user: userToFollow,
        });

        return [followerCount.count, followeeCount.count];
    }

    public async getFollowerCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        await this.checkToken(token);
        return this.followDAO.getFollowerCount(user.alias);
    }

    public async getFolloweeCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        await this.checkToken(token);
        return this.followDAO.getFolloweeCount(user.alias);
    }

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        await this.checkToken(token);
        return this.userDAO.isFollower(user.alias, selectedUser.alias);
    }
}
