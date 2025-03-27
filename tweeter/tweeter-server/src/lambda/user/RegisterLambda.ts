import { RegisterRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoFactory } from "../../model/daos/DynamoDB/DynamoFactory";

export const handler = async (
    request: RegisterRequest
): Promise<LoginResponse> => {
    const userService = new UserService(new DynamoFactory());
    const [user, token] = await userService.register(
        request.firstName,
        request.lastName,
        request.alias,
        request.password,
        request.imageStringBase64,
        request.imageFileExtension
    );

    return {
        success: true,
        message: null,
        user: user,
        token: token,
    };
};
