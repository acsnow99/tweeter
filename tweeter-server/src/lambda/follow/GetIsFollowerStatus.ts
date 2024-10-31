import { GetIsFollowerStatusRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService"

export const handler = async (request: GetIsFollowerStatusRequest): Promise<boolean> => {
    const service = new UserService();
    return await service.getIsFollowerStatus(request.authToken, request.user, request.selectedUser);
}
