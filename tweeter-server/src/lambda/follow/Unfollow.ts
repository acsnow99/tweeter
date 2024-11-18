import { FollowRequest, FollowResponse } from "tweeter-shared/src";
import { getUserService } from "../utils";
import { followStructure } from "./FollowStructure";
import { UserDto } from "tweeter-shared";

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
    const service = getUserService();
    return await followStructure(request, (token: string, user: UserDto) => service.unfollow(token, user))
}