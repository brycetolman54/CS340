import { FakeData, UserDto, AuthTokenDto, User, Follow } from "tweeter-shared";
import { followerHandler } from "../../lambda/follow/GetFollowerCountLambda";
import { followeeHandler } from "../../lambda/follow/GetFolloweeCountLambda";
import { FactoryDAO } from "../daos/FactoryDAO";
import { UserDAO } from "../daos/UserDAO";
import { ImageDAO } from "../daos/ImageDAO";
import { FollowDAO } from "../daos/FollowDAO";

export class UserService {
    private factory: FactoryDAO;
    private userDAO: UserDAO;
    private imageDAO: ImageDAO;
    private followDAO: FollowDAO;

    public constructor(factory: FactoryDAO) {
        this.factory = factory;
        this.userDAO = factory.getUserDAO();
        this.imageDAO = factory.getImageDAO();
        this.followDAO = factory.getFollowDAO();
    }

    public async getUser(
        token: string,
        alias: string
    ): Promise<UserDto | null> {
        const user = FakeData.instance.findUserByAlias(alias);
        return user == null ? null : user.dto;
    }

    public async logout(token: string): Promise<void> {
        await new Promise((res) => setTimeout(res, 1000));
    }

    public async login(
        alias: string,
        password: string
    ): Promise<[UserDto, AuthTokenDto]> {
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid alias or password");
        }

        const token = FakeData.instance.authToken;

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
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        const token = FakeData.instance.authToken;

        return [user.dto, token.dto];
    }

    public async unfollow(
        token: string,
        userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        await new Promise((f) => setTimeout(f, 2000));

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
        await new Promise((f) => setTimeout(f, 2000));

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
        return FakeData.instance.getFollowerCount(user.alias);
    }

    public async getFolloweeCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        return FakeData.instance.getFolloweeCount(user.alias);
    }

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        return FakeData.instance.isFollower();
    }
}
