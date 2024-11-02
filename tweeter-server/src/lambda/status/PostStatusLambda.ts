import { StatusService } from "../../model/service/StatusService"
import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
    const service = new StatusService();
    const {
        authToken,
        newStatus
    } = request;
    const response = await service.postStatus(authToken, newStatus);
    return {
        success: true,
        message: null
    }
}