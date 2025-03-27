import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/daos/DynamoDB/DynamoFactory";

export const handler = async (
    request: GetUserRequest
): Promise<GetUserResponse> => {
    const userService = new UserService(new DynamoFactory());
    const user = await userService.getUser(request.token, request.alias);

    return {
        success: true,
        message: null,
        user: user,
    };
};
