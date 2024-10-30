import { PagedUserItemRequest, PagedUserItemResponse } from 'tweeter-shared/src';
import { UserService } from '../../model/service/UserService';

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
    const service = new UserService();
    const [items, hasMore] = await service.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);

    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}
