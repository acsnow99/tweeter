import { FollowRequest, FollowResponse } from "tweeter-shared/src";
import { UserDto } from "tweeter-shared";

export const followStructure = async (request: FollowRequest, serviceFunction: (token: string, user: UserDto) => Promise<[number, number]>): Promise<FollowResponse> => {
    const {
        token,
        user,
    } = request;
    const [followerCount, followeeCount] = await serviceFunction(token, user);
    return {
        success: true,
        message: null,
        followerCount,
        followeeCount
    }
}