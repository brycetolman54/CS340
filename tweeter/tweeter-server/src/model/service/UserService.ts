import { UserDto, AuthTokenDto, AuthToken } from "tweeter-shared";
import { FactoryDAO } from "../daos/FactoryDAO";
import { UserDAO } from "../daos/UserDAO";
import { FollowDAO } from "../daos/FollowDAO";
import { Service } from "./Service";
import { ImageDAO } from "../daos/ImageDAO";

export class UserService extends Service {
    private userDAO: UserDAO;
    private followDAO: FollowDAO;
    private imageDAO: ImageDAO;

    public constructor(factory: FactoryDAO) {
        super(factory);
        this.userDAO = factory.getUserDAO();
        this.followDAO = factory.getFollowDAO();
        this.imageDAO = factory.getImageDAO();
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
        const user = await this.userDAO.getUserWithPassword(
            "@" + alias,
            password
        );

        if (user === null) {
            throw new Error("[Bad Request] Invalid alias or password");
        }

        const token = AuthToken.Generate();
        await this.authorizationDAO.addToken(token, user.alias);

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
            "@" + alias,
            password
        );

        if (user === null) {
            throw new Error("[Bad Request] Invalid registration");
        }

        const imageUrl = await this.imageDAO.putImage(
            imageStringBase64,
            imageFileExtension,
            alias
        );
        await this.userDAO.updateImageURL(user.alias, imageUrl);
        user.imageUrl = imageUrl;

        const token = AuthToken.Generate();
        await this.authorizationDAO.addToken(token, user.alias);

        return [user.dto, token.dto];
    }

    public async changeFollow(
        token: string,
        followUser: UserDto,
        follow: boolean
    ): Promise<[followerCount: number, followeeCount: number]> {
        await this.checkToken(token);

        const alias = await this.authorizationDAO.getAliasFromToken(token);

        if (follow) {
            await this.followDAO.addFollow(alias, followUser.alias);
        } else {
            await this.followDAO.deleteFollow(alias, followUser.alias);
        }

        const followerCount = await this.followDAO.getFollowCount(
            followUser.alias,
            true
        );
        const followeeCount = await this.followDAO.getFollowCount(
            followUser.alias,
            false
        );

        return [followerCount, followeeCount];
    }

    public async getFollowCount(
        token: string,
        user: UserDto,
        followers: boolean
    ): Promise<number> {
        await this.checkToken(token);
        return await this.followDAO.getFollowCount(user.alias, followers);
    }

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        await this.checkToken(token);
        return await this.userDAO.isFollower(user.alias, selectedUser.alias);
    }
}
