import { FollowStatusRequest, FollowStatusResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
    request: FollowStatusRequest
): Promise<FollowStatusResponse> => {
    const userService = new UserService();
    const isFollower = await userService.getIsFollowerStatus(
        request.token,
        request.user,
        request.selectedUser
    );

    return {
        success: true,
        message: null,
        isFollower: isFollower,
    };
};
