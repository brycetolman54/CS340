import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/daos/DynamoDB/DynamoFactory";

export const handler = async (
    request: LoginRequest
): Promise<LoginResponse> => {
    const userService = new UserService(new DynamoFactory());
    const [user, token] = await userService.login(
        request.alias,
        request.password
    );
    return {
        success: true,
        message: null,
        user: user,
        token: token,
    };
};
