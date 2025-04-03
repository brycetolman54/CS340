import { PagedItemRequest, PagedItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { DynamoFactory } from "../../model/daos/DynamoDB/DynamoFactory";

export const handler = async (
    request: PagedItemRequest<UserDto>
): Promise<PagedItemResponse<UserDto>> => {
    const followService = new FollowService(new DynamoFactory());
    const [items, hasMore] = await followService.loadMoreFollows(
        request.token,
        request.userAlias,
        request.pageSize,
        request.lastItem,
        false
    );

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore,
    };
};
