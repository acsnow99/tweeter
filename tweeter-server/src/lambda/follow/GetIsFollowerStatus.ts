import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService"

export const handler = async (request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
    const service = new UserService();
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
