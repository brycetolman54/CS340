import { AuthorizedRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/daos/DynamoDB/DynamoFactory";

export const handler = async (
    request: AuthorizedRequest
): Promise<TweeterResponse> => {
    const userService = new UserService(new DynamoFactory());
    await userService.logout(request.token);

    return {
        success: true,
        message: null,
    };
};
