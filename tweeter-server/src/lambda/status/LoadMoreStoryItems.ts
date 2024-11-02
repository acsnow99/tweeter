import { StatusRequest, StatusResponse } from "tweeter-shared/src";
import { StatusService } from "../../model/service/StatusService"

export const handler = async (request: StatusRequest): Promise<StatusResponse> => {
    const service = new StatusService();
    const {
        authToken,
        userAlias,
        pageSize,
        lastItem
    } = request;
    const [items, hasMore] = await service.loadMoreStoryItems(authToken, userAlias, pageSize, lastItem);
    return {
        success: true,
        message: null,
        items,
        hasMore,
    }
}