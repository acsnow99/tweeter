import { StatusRequest, StatusResponse } from "tweeter-shared";
import { getStatusService } from "../utils";

export const handler = async (request: StatusRequest): Promise<StatusResponse> => {
    const service = getStatusService();
    const {
        authToken,
        userAlias,
        pageSize,
        lastItem
    } = request;
    const [items, hasMore] = await service.loadMoreFeedItems(authToken, userAlias, pageSize, lastItem);
    return {
        success: true,
        message: null,
        items,
        hasMore
    }
}