import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";
import { getStatusService } from "../utils";

export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {
    const service = getStatusService();
    const {
        authToken,
        newStatus
    } = request;
    console.log("Starting post");
    const response = await service.postStatus(authToken, newStatus);
    return {
        success: true,
        message: null
    }
}