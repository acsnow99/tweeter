import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { getUserService } from "../utils";

export const handler = async (request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
    const service = getUserService();
    const {
        authToken,
        user,
        selectedUser
    } = request;
    const status = await service.getIsFollowerStatus(authToken, user, selectedUser);
    return {
        success: true,
        message: null,
        status: status,
    }
}
