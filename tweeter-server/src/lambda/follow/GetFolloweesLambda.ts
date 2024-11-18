import { PagedUserItemRequest, PagedUserItemResponse } from 'tweeter-shared/src';
import { getUserService } from "../utils";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    const service = getUserService();
    const [items, hasMore] = await service.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}
