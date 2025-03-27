import { TweeterResponse, PostRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoFactory } from "../../model/daos/DynamoDB/DynamoFactory";

export const handler = async (
    request: PostRequest
): Promise<TweeterResponse> => {
    const statusService = new StatusService(new DynamoFactory());
    await statusService.postStatus(request.token, request.newStatus);

    return {
        success: true,
        message: null,
    };
};
