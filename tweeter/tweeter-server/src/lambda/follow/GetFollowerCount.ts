import { FollowRequest, CountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const followerHandler = async (
    request: FollowRequest
): Promise<CountResponse> => {
    const userService = new UserService();
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
