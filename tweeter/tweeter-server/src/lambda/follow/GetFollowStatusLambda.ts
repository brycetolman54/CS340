import { FollowStatusRequest, FollowStatusResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/daos/DynamoDB/DynamoFactory";

export const handler = async (
    request: FollowStatusRequest
): Promise<FollowStatusResponse> => {
    const userService = new UserService(new DynamoFactory());
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
