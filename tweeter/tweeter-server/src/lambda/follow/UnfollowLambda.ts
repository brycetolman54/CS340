import { FollowRequest, FollowResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/daos/DynamoDB/DynamoFactory";

export const handler = async (
    request: FollowRequest
): Promise<FollowResponse> => {
    const userService = new UserService(new DynamoFactory());
    const [followerCount, followeeCount] = await userService.unfollow(
        request.token,
        request.user
    );

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount,
    };
};
