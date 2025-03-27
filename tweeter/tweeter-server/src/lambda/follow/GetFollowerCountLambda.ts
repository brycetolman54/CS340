import { FollowRequest, CountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/daos/DynamoDB/DynamoFactory";

export const followerHandler = async (
    request: FollowRequest
): Promise<CountResponse> => {
    const userService = new UserService(new DynamoFactory());
    const count = await userService.getFollowerCount(
        request.token,
        request.user
    );

    return {
        success: true,
        message: null,
        count: count,
    };
};
