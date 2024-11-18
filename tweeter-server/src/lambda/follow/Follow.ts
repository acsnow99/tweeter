import { FollowRequest, FollowResponse } from "tweeter-shared/src";
import { followStructure } from "./FollowStructure";
import { UserDto } from "tweeter-shared";
import { getUserService } from "../utils";

export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
    const service = getUserService();
    return await followStructure(request, (token: string, user: UserDto) => service.follow(token, user))
}