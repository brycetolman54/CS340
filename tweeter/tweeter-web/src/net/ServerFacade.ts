import {
    AuthorizedRequest,
    AuthToken,
    CountResponse,
    FollowRequest,
    FollowResponse,
    FollowStatusRequest,
    FollowStatusResponse,
    GetUserRequest,
    GetUserResponse,
    LoginRequest,
    LoginResponse,
    PagedItemRequest,
    PagedItemResponse,
    PostRequest,
    RegisterRequest,
    Status,
    StatusDto,
    TweeterResponse,
    User,
    UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL =
        "https://pieg6cvrtk.execute-api.us-east-1.amazonaws.com/dev";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    public async getMoreFollowees(
        request: PagedItemRequest<UserDto>
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.httpPost<
            PagedItemRequest<UserDto>,
            PagedItemResponse<UserDto>
        >(request, "/followee/list");

        const items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        if (response.success) {
            if (items == null) {
                throw new Error(`No followees found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async getMoreFollowers(
        request: PagedItemRequest<UserDto>
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.httpPost<
            PagedItemRequest<UserDto>,
            PagedItemResponse<UserDto>
        >(request, "/follower/list");

        const items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        if (response.success) {
            if (items == null) {
                throw new Error(`No followees found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async getMoreFeedItems(
        request: PagedItemRequest<StatusDto>
    ): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.httpPost<
            PagedItemRequest<StatusDto>,
            PagedItemResponse<StatusDto>
        >(request, "/feed/load");

        const items: Status[] | null =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        if (response.success) {
            if (items == null) {
                throw new Error(`No followees found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async getMoreStoryItems(
        request: PagedItemRequest<StatusDto>
    ): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.httpPost<
            PagedItemRequest<StatusDto>,
            PagedItemResponse<StatusDto>
        >(request, "/story/load");

        const items: Status[] | null =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        if (response.success) {
            if (items == null) {
                throw new Error(`No followees found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async postStatus(request: PostRequest): Promise<void> {
        const response = await this.clientCommunicator.httpPost<
            PostRequest,
            TweeterResponse
        >(request, "/status/post");

        if (!response.success) {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async login(request: LoginRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.httpPost<
            LoginRequest,
            LoginResponse
        >(request, "/user/login");

        if (response.success) {
            return [
                User.fromDto(response.user) as User,
                AuthToken.fromDto(response.token) as AuthToken,
            ];
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async logout(request: AuthorizedRequest): Promise<void> {
        const response = await this.clientCommunicator.httpPost<
            AuthorizedRequest,
            TweeterResponse
        >(request, "/user/logout");

        if (!response.success) {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async register(
        request: RegisterRequest
    ): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.httpPost<
            RegisterRequest,
            LoginResponse
        >(request, "/user/register");

        if (response.success) {
            return [
                User.fromDto(response.user) as User,
                AuthToken.fromDto(response.token) as AuthToken,
            ];
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async getUser(request: GetUserRequest): Promise<User | null> {
        const response = await this.clientCommunicator.httpPost<
            GetUserRequest,
            GetUserResponse
        >(request, "/user/get");

        if (response.success) {
            if (response.user == null) {
                throw new Error(`No user found with that alias`);
            } else {
                return User.fromDto(response.user);
            }
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async unfollow(
        request: FollowRequest
    ): Promise<[followerCount: number, followeeCount: number]> {
        const response = await this.clientCommunicator.httpPost<
            FollowRequest,
            FollowResponse
        >(request, "/user/unfollow");

        if (response.success) {
            return [response.followerCount, response.followeeCount];
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async follow(
        request: FollowRequest
    ): Promise<[followerCount: number, followeeCount: number]> {
        const response = await this.clientCommunicator.httpPost<
            FollowRequest,
            FollowResponse
        >(request, "/user/follow");

        if (response.success) {
            return [response.followerCount, response.followeeCount];
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async getFollowerCount(request: FollowRequest): Promise<number> {
        const response = await this.clientCommunicator.httpPost<
            FollowRequest,
            CountResponse
        >(request, "/follower/count");

        if (response.success) {
            return response.count;
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async getFolloweeCount(request: FollowRequest): Promise<number> {
        const response = await this.clientCommunicator.httpPost<
            FollowRequest,
            CountResponse
        >(request, "/followee/count");

        if (response.success) {
            return response.count;
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }

    public async getIsFollowerStatus(
        request: FollowStatusRequest
    ): Promise<boolean> {
        const response = await this.clientCommunicator.httpPost<
            FollowStatusRequest,
            FollowStatusResponse
        >(request, "/status/follow");

        if (response.success) {
            return response.isFollower;
        } else {
            console.error(response);
            throw new Error(
                response.message == null ? undefined : response.message
            );
        }
    }
}
