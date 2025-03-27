import { PagedItemRequest, PagedItemResponse, StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoFactory } from "../../model/daos/DynamoDB/DynamoFactory";

export const handler = async (
    request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
    const statusService = new StatusService(new DynamoFactory());
    const [items, hasMore] = await statusService.loadMoreStoryItems(
        request.token,
        request.userAlias,
        request.pageSize,
        request.lastItem
    );

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore,
    };
};
