import { AuthorizedRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (
    request: AuthorizedRequest
): Promise<TweeterResponse> => {
    const userService = new UserService();
    await userService.logout(request.token);

    return {
        success: true,
        message: null,
    };
};
