import { getUserService } from "../utils";
import { GetFollowCountRequest, GetFollowCountResponse } from 'tweeter-shared/src';


export const handler = async (request: GetFollowCountRequest): Promise<GetFollowCountResponse> => {
    const service = getUserService();
    const {
        token,
        user
    } = request;
    const count = await service.getFolloweeCount(token, user);
    return {
        success: true,
        message: null,
        count: count,
    }
}