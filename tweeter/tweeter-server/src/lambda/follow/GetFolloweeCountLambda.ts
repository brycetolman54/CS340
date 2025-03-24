import { FollowRequest, CountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const followeeHandler = async (
    request: FollowRequest
): Promise<CountResponse> => {
    const userService = new UserService();
    const count = await userService.getFolloweeCount(
        request.token,
        request.user
    );

    return {
        success: true,
        message: null,
        count: count,
    };
};
