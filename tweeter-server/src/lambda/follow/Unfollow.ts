import { FollowRequest, FollowResponse } from "tweeter-shared/src";
import { UserService } from "../../model/service/UserService"
import { followStructure } from "./FollowStructure";
import { UserDto } from "tweeter-shared";

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
    const service = new UserService();
    return await followStructure(request, (token: string, user: UserDto) => service.unfollow(token, user))
}